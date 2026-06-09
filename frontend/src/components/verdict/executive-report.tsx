import { VerdictData, EvidenceClaim, CouncilPreset } from "@/lib/types";

interface ExecutiveReportProps {
  data: VerdictData;
  preset: CouncilPreset;
  proposal: string;
  claims: EvidenceClaim[];
  advocateText: string;
  inquisitorText: string;
  arbitratorText: string;
}

export function ExecutiveReport({
  data,
  preset,
  proposal,
  claims,
  advocateText,
  inquisitorText,
}: ExecutiveReportProps) {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="hidden print:block w-full text-black bg-white font-serif max-w-4xl mx-auto text-sm leading-relaxed">
      {/* Cover Page */}
      <div className="min-h-screen flex flex-col justify-center items-center text-center p-20 break-after-page">
        <h1 className="text-4xl font-bold uppercase tracking-widest mb-4">Council AI</h1>
        <h2 className="text-2xl text-gray-600 mb-12">Executive Deliberation Report</h2>
        <div className="w-16 h-[1px] bg-black mb-12" />
        <p className="text-lg mb-2">{preset.name}</p>
        <p className="text-gray-500 mb-20">{date}</p>
        
        <div className="mt-20 p-8 border-2 border-black max-w-sm w-full">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Final Verdict</p>
          <p className="text-3xl font-bold">{data.verdict}</p>
          <p className="text-sm mt-4 text-gray-600">Confidence: {data.confidence}%</p>
        </div>
      </div>

      <div className="p-12">
        {/* Section 1: Proposal Summary */}
        <section className="mb-12">
          <h3 className="text-xl font-bold uppercase tracking-widest border-b-2 border-black pb-2 mb-6">Section 1: Proposal Summary</h3>
          <p className="whitespace-pre-wrap font-sans text-gray-800">{proposal}</p>
        </section>

        {/* Section 2: Core Claims Extracted */}
        <section className="mb-12 break-inside-avoid">
          <h3 className="text-xl font-bold uppercase tracking-widest border-b-2 border-black pb-2 mb-6">Section 2: Claims Extracted</h3>
          <div className="space-y-4">
            {claims.map((claim, idx) => (
              <div key={claim.id} className="border border-gray-300 p-4 rounded bg-gray-50 font-sans">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-700">C{idx + 1}</span>
                  <span className="text-xs uppercase tracking-widest font-bold text-gray-500">{claim.status}</span>
                </div>
                <p className="text-gray-800">{claim.text}</p>
                {(claim.status === "CHALLENGED" || claim.status === "INVALIDATED") && claim.attackedBy && (
                  <p className="text-xs text-red-700 mt-2 font-bold">Attacked By: {claim.attackedBy}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Advocate Position */}
        <section className="mb-12 break-inside-avoid">
          <h3 className="text-xl font-bold uppercase tracking-widest border-b-2 border-black pb-2 mb-6">Section 3: {preset.advocate_title} Position</h3>
          <div className="prose max-w-none font-sans text-gray-800">
            {/* Split by double newline to render basic paragraphs instead of full markdown parser to save weight */}
            {advocateText.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="mb-4">{paragraph.replace(/\*\*/g, '')}</p>
            ))}
          </div>
        </section>

        {/* Section 4: Inquisitor Position */}
        <section className="mb-12 break-inside-avoid">
          <h3 className="text-xl font-bold uppercase tracking-widest border-b-2 border-black pb-2 mb-6">Section 4: {preset.inquisitor_title} Position</h3>
          <div className="prose max-w-none font-sans text-gray-800">
            {inquisitorText.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="mb-4">{paragraph.replace(/\*\*/g, '')}</p>
            ))}
          </div>
        </section>

        {/* Section 5: Council Verdict */}
        <section className="mb-12 break-inside-avoid">
          <h3 className="text-xl font-bold uppercase tracking-widest border-b-2 border-black pb-2 mb-6">Section 5: Council Verdict Data</h3>
          <table className="w-full text-left font-sans text-gray-800 border-collapse">
            <tbody>
              <tr className="border-b border-gray-200">
                <th className="py-3 font-semibold w-1/3 text-gray-600">Verdict</th>
                <td className="py-3 font-bold text-lg">{data.verdict}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <th className="py-3 font-semibold text-gray-600">Confidence</th>
                <td className="py-3">{data.confidence}%</td>
              </tr>
              <tr className="border-b border-gray-200">
                <th className="py-3 font-semibold text-gray-600">Winning Side</th>
                <td className="py-3">{data.winning_side}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <th className="py-3 font-semibold text-gray-600">Winning Claim ID</th>
                <td className="py-3">{data.winning_claim_id || "N/A"}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <th className="py-3 font-semibold text-gray-600">Fatal Flaw</th>
                <td className="py-3">{data.fatal_flaw}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <th className="py-3 font-semibold text-gray-600">Asymmetric Upside</th>
                <td className="py-3">{data.asymmetric_upside}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <th className="py-3 font-semibold text-gray-600">Winning Argument</th>
                <td className="py-3 italic">"{data.winning_argument}"</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Section 6: Arbitrator's Final Ruling */}
        <section className="mb-12 break-inside-avoid">
          <h3 className="text-xl font-bold uppercase tracking-widest border-b-2 border-black pb-2 mb-6">Section 6: {preset.arbitrator_title}'s Final Ruling</h3>
          <div className="p-6 bg-gray-100 border-l-4 border-black font-serif italic text-lg leading-relaxed text-gray-900">
            {data.rationale}
          </div>
        </section>
        
        <div className="text-center text-xs text-gray-400 mt-20 pt-8 border-t border-gray-200">
          Generated by Council AI
        </div>
      </div>
    </div>
  );
}
