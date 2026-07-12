import requests

url = "http://localhost:5000/api/data/upload"
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZThmMDQ5NDMzZDliZWE2YTExNWJiOCIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTc3Njg3NTEyOCwiZXhwIjoxNzc2OTYxNTI4fQ.d6IfaSR4npOzspPEf6NBX1JzUK6GPXDs2MBkf98wIq4"
file_path = "city_wise_solar_2014_2024.csv"

headers = {
    "Authorization": f"Bearer {token}"
}

with open(file_path, "rb") as f:
    files = {"file": f}
    response = requests.post(url, headers=headers, files=files)

print(response.status_code)
print(response.json())
