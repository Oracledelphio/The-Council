import requests

url = "http://127.0.0.1:8000/api/v1/inquisitor"
payload = {
    "proposal": "This proposal fundamentally redefines academic productivity by introducing AI-driven study habits.",
    "claims": [
        "AI-driven study habits",
        "Redefines academic productivity",
        "Targeted at students"
    ]
}
response = requests.post(url, json=payload, stream=True)
for chunk in response.iter_content(chunk_size=1024):
    if chunk:
        print(chunk.decode('utf-8'), end='')
