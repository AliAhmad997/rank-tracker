import os
import requests
import json

API_KEY = os.getenv('API_KEY')
BASE_URL = os.getenv('BASE_URL')

def rank_tracker(keyword, domain, country, city):
    body = {
        "url": "https://www.google.com",
        "module": "GoogleScraper",
        "params": {
            "query": keyword,
            "location": f"{city}, {country}",
            "num": 100,
            "countryCode": country[:2].lower(),
            "languageCode": "en",
            "proxyCountry": country[:2].upper()
        }
    }
    
    headers = {'Content-Type': 'application/json'}
    api_url = f'{BASE_URL}?token={API_KEY}'
    
    response = requests.post(api_url, headers=headers, data=json.dumps(body))
    
    if response.status_code == 200:
        data = response.json()
        results = data.get('result', {}).get('organicResults', [])
        
        for i, result in enumerate(results, start=1):
            result_url = result.get('url', '')
            result_domain = result_url.split('/')[2]
            
            if domain in result_domain:
                print(f"{i}: {result_url}")
    else:
        print(f"Error: {response.status_code} - {response.text}")

if __name__ == "__main__":
    keyword = input("Enter the keyword: ")
    domain = input("Enter the domain (e.g., aliahmadseo.com): ")
    country = input("Enter the country code (e.g., AE for UAE): ")
    city = input("Enter the city: ")

    rank_tracker(keyword, domain, country, city)
