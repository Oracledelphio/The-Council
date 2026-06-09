import logging
import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient

from core.config import settings

logger = logging.getLogger(__name__)

class DatabaseService:
    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.db = None
        self.decisions_collection = None

    async def connect(self):
        """Initialize MongoDB connection."""
        if not self.client:
            try:
                self.client = AsyncIOMotorClient(settings.MONGODB_URI)
                self.db = self.client[settings.MONGODB_DB_NAME]
                self.decisions_collection = self.db["decisions"]
                # Ensure an index on created_at for sorting
                await self.decisions_collection.create_index([("created_at", -1)])
                # Text index for basic search
                await self.decisions_collection.create_index([("proposal", "text")])
                logger.info("Connected to MongoDB successfully.")
            except Exception as e:
                logger.error(f"Failed to connect to MongoDB: {e}")
                self.client = None

    async def close(self):
        """Close MongoDB connection."""
        if self.client:
            self.client.close()

    async def get_collection(self):
        """Get the decisions collection, ensuring connection."""
        if not self.client:
            await self.connect()
        return self.decisions_collection

    def _generate_decision_id(self) -> str:
        """Generate a readable decision ID e.g. COUNCIL-2026-001"""
        # In a robust system, we would use a sequence generator in MongoDB
        # For simplicity in this Hackathon MVP, we use a UUID prefix or short hash
        year = datetime.now(timezone.utc).year
        short_uuid = str(uuid.uuid4())[:6].upper()
        return f"COUNCIL-{year}-{short_uuid}"

    async def save_decision(self, data: Dict[str, Any]) -> str:
        """
        Store a completed deliberation in MongoDB.
        """
        collection = await self.get_collection()
        if collection is None:
            logger.warning("MongoDB not connected. Cannot save decision.")
            return ""

        decision_id = self._generate_decision_id()
        document = {
            "decision_id": decision_id,
            "created_at": datetime.now(timezone.utc),
            "council_type": data.get("council_type", "Unknown"),
            "proposal": data.get("proposal", ""),
            "claims": data.get("claims", []),
            "advocate": {
                "output": data.get("advocate_output", "")
            },
            "inquisitor": {
                "output": data.get("inquisitor_output", "")
            },
            "arbitrator": {
                "verdict": data.get("verdict", ""),
                "confidence": data.get("confidence", 0),
                "fatal_flaw": data.get("fatal_flaw", ""),
                "asymmetric_upside": data.get("asymmetric_upside", ""),
                "rationale": data.get("rationale", "")
            }
        }
        
        await collection.insert_one(document)
        return decision_id

    async def get_recent_decisions(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Fetch recent decisions for the sidebar."""
        collection = await self.get_collection()
        if collection is None:
            return []
        
        cursor = collection.find({}).sort("created_at", -1).limit(limit)
        decisions = await cursor.to_list(length=limit)
        
        # Format for frontend
        for d in decisions:
            d["_id"] = str(d["_id"])
            
        return decisions

    async def get_decision_by_id(self, decision_id: str) -> Optional[Dict[str, Any]]:
        """Fetch a single historical report."""
        collection = await self.get_collection()
        if collection is None:
            return None
            
        decision = await collection.find_one({"decision_id": decision_id})
        if decision:
            decision["_id"] = str(decision["_id"])
        return decision

    async def delete_decision(self, decision_id: str) -> bool:
        """Permanently delete a decision."""
        collection = await self.get_collection()
        if collection is None:
            return False
            
        result = await collection.delete_one({"decision_id": decision_id})
        return result.deleted_count > 0

    async def search_similar_decisions(self, query: str, limit: int = 3) -> List[Dict[str, Any]]:
        """
        Search for similar historical decisions.
        
        CURRENT MVP IMPLEMENTATION: Keyword / Text matching via MongoDB text index.
        FUTURE UPGRADE PATH: Atlas Vector Search with Embeddings.
        The service abstraction guarantees the route / frontend won't change.
        """
        collection = await self.get_collection()
        if collection is None:
            return []
            
        # Basic text search as MVP
        cursor = collection.find(
            {"$text": {"$search": query}},
            {"score": {"$meta": "textScore"}}
        ).sort([("score", {"$meta": "textScore"})]).limit(limit)
        
        results = await cursor.to_list(length=limit)
        for r in results:
            r["_id"] = str(r["_id"])
        return results

    async def get_analytics_metrics(self) -> Dict[str, Any]:
        """Calculate total decisions, fund/kill rates, etc."""
        collection = await self.get_collection()
        if collection is None:
            return {
                "total_decisions": 0,
                "fund_rate": 0,
                "kill_rate": 0,
                "council_usage": []
            }
            
        total = await collection.count_documents({})
        if total == 0:
            return {
                "total_decisions": 0,
                "fund_rate": 0,
                "kill_rate": 0,
                "council_usage": []
            }
            
        # Positive verdicts (FUND, APPROVE, PROCEED)
        positive_count = await collection.count_documents({"arbitrator.verdict": {"$in": ["FUND", "APPROVE", "PROCEED"]}})
        # Negative verdicts (KILL, REJECT, HALT)
        negative_count = await collection.count_documents({"arbitrator.verdict": {"$in": ["KILL", "REJECT", "HALT"]}})
        
        # Group by council type
        pipeline = [
            {"$group": {"_id": "$council_type", "count": {"$sum": 1}}}
        ]
        council_usage = []
        async for doc in collection.aggregate(pipeline):
            council_usage.append({"type": doc["_id"], "count": doc["count"]})
            
        return {
            "total_decisions": total,
            "fund_rate": round((positive_count / total) * 100, 1),
            "kill_rate": round((negative_count / total) * 100, 1),
            "council_usage": council_usage
        }

db = DatabaseService()
