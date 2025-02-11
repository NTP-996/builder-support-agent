import requests

url = "http://localhost:11434/api/generate"
payload = {
    "model": "deepseek-r1:14b",
    "prompt": "I want to build XCM channel, please tell me something about this?",
    "stream": False
}

response = requests.post(url, json=payload)
data = response.json()

print(data["response"]) 


# Em ghi prompt o day, roi doi  no tra respone ve, nay la deploy len localhost roi do anh 