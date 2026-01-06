"""
Simple Backend API Tester
Tests each endpoint one by one
"""
import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_endpoint(method, endpoint, data=None, description=""):
    """Test a single endpoint"""
    url = f"{BASE_URL}{endpoint}"
    
    print(f"\n{'='*60}")
    print(f"Testing: {method} {endpoint}")
    if description:
        print(f"Description: {description}")
    print('='*60)
    
    try:
        if method == "GET":
            response = requests.get(url, timeout=5)
        elif method == "POST":
            response = requests.post(url, json=data, timeout=5)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            try:
                json_data = response.json()
                print(f"Response: {json.dumps(json_data, indent=2, ensure_ascii=False)[:500]}...")
                print(f"\nResult: SUCCESS - {len(json_data) if isinstance(json_data, list) else 1} items returned")
                return True
            except:
                print(f"Response: {response.text[:200]}")
                print(f"\nResult: SUCCESS")
                return True
        else:
            print(f"Response: {response.text[:200]}")
            print(f"\nResult: FAILED")
            return False
            
    except requests.exceptions.ConnectionError:
        print("Result: FAILED - Server not running or not accessible")
        return False
    except Exception as e:
        print(f"Result: FAILED - {str(e)}")
        return False

def main():
    print("\n" + "="*60)
    print("  BACKEND VERIFICATION TEST SUITE")
    print("  Testing all API endpoints")
    print("="*60)
    
    results = []
    
    # Test 1: Get all content
    results.append(test_endpoint(
        "GET", 
        "/api/content",
        description="Get all site configuration"
    ))
    
    # Test 2: Get hero content
    results.append(test_endpoint(
        "GET", 
        "/api/content/hero",
        description="Get hero section configuration"
    ))
    
    # Test 3: Get promotions
    results.append(test_endpoint(
        "GET", 
        "/api/promotions",
        description="Get active promotions"
    ))
    
    # Test 4: Get projects
    results.append(test_endpoint(
        "GET", 
        "/api/projects",
        description="Get all projects"
    ))
    
    # Test 5: Get services
    results.append(test_endpoint(
        "GET", 
        "/api/services",
        description="Get all services"
    ))
    
    # Test 6: Post contact message
    test_data = {
        "sender_name": "Test User",
        "contact_info": "test@example.com",
        "content": "This is a test message"
    }
    results.append(test_endpoint(
        "POST", 
        "/api/contact",
        data=test_data,
        description="Submit contact form"
    ))
    
    # Summary
    print("\n\n" + "="*60)
    print("  TEST SUMMARY")
    print("="*60)
    total = len(results)
    passed = sum(results)
    failed = total - passed
    
    print(f"Total Tests: {total}")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    
    if failed == 0:
        print("\nAll tests PASSED!")
    else:
        print(f"\n{failed} test(s) FAILED - please review")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()
