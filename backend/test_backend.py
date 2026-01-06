"""
Backend Verification Test Script
Tests all API endpoints and verifies functionality
"""
import asyncio
import httpx
import json
from datetime import datetime

# API Base URL (adjust if different)
BASE_URL = "http://localhost:8000"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'
    BOLD = '\033[1m'

def print_test(name, status, details=""):
    """Print test result with colors"""
    symbol = f"{Colors.GREEN}✓{Colors.END}" if status else f"{Colors.RED}✗{Colors.END}"
    print(f"{symbol} {Colors.BOLD}{name}{Colors.END}")
    if details:
        print(f"  {Colors.YELLOW}{details}{Colors.END}")

def print_header(text):
    """Print section header"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}{Colors.BOLD}{text}{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}\n")

async def test_api_endpoints():
    """Test all API endpoints"""
    async with httpx.AsyncClient() as client:
        results = {
            "passed": 0,
            "failed": 0,
            "total": 0
        }
        
        # Test 1: Get all content
        print_header("Testing API Endpoints")
        try:
            response = await client.get(f"{BASE_URL}/api/content")
            if response.status_code == 200:
                data = response.json()
                print_test("GET /api/content", True, f"Found {len(data)} config items")
                results["passed"] += 1
            else:
                print_test("GET /api/content", False, f"Status: {response.status_code}")
                results["failed"] += 1
        except Exception as e:
            print_test("GET /api/content", False, f"Error: {str(e)}")
            results["failed"] += 1
        results["total"] += 1
        
        # Test 2: Get content by group
        try:
            response = await client.get(f"{BASE_URL}/api/content/hero")
            if response.status_code == 200:
                data = response.json()
                print_test("GET /api/content/hero", True, f"Found {len(data)} items")
                results["passed"] += 1
            else:
                print_test("GET /api/content/hero", False, f"Status: {response.status_code}")
                results["failed"] += 1
        except Exception as e:
            print_test("GET /api/content/hero", False, f"Error: {str(e)}")
            results["failed"] += 1
        results["total"] += 1
        
        # Test 3: Get promotions
        try:
            response = await client.get(f"{BASE_URL}/api/promotions")
            if response.status_code == 200:
                data = response.json()
                print_test("GET /api/promotions", True, f"Found {len(data)} promotions")
                results["passed"] += 1
            else:
                print_test("GET /api/promotions", False, f"Status: {response.status_code}")
                results["failed"] += 1
        except Exception as e:
            print_test("GET /api/promotions", False, f"Error: {str(e)}")
            results["failed"] += 1
        results["total"] += 1
        
        # Test 4: Get projects
        try:
            response = await client.get(f"{BASE_URL}/api/projects")
            if response.status_code == 200:
                data = response.json()
                print_test("GET /api/projects", True, f"Found {len(data)} projects")
                results["passed"] += 1
            else:
                print_test("GET /api/projects", False, f"Status: {response.status_code}")
                results["failed"] += 1
        except Exception as e:
            print_test("GET /api/projects", False, f"Error: {str(e)}")
            results["failed"] += 1
        results["total"] += 1
        
        # Test 5: Get services
        try:
            response = await client.get(f"{BASE_URL}/api/services")
            if response.status_code == 200:
                data = response.json()
                print_test("GET /api/services", True, f"Found {len(data)} services")
                results["passed"] += 1
            else:
                print_test("GET /api/services", False, f"Status: {response.status_code}")
                results["failed"] += 1
        except Exception as e:
            print_test("GET /api/services", False, f"Error: {str(e)}")
            results["failed"] += 1
        results["total"] += 1
        
        # Test 6: POST contact message
        try:
            test_message = {
                "sender_name": "Test User",
                "contact_info": "test@example.com",
                "content": "This is a test message from backend verification script"
            }
            response = await client.post(f"{BASE_URL}/api/contact", json=test_message)
            if response.status_code == 200:
                data = response.json()
                print_test("POST /api/contact", True, f"Message ID: {data.get('id', 'N/A')}")
                results["passed"] += 1
            else:
                print_test("POST /api/contact", False, f"Status: {response.status_code}")
                results["failed"] += 1
        except Exception as e:
            print_test("POST /api/contact", False, f"Error: {str(e)}")
            results["failed"] += 1
        results["total"] += 1
        
        return results

async def test_database_connection():
    """Test database connection and basic operations"""
    print_header("Testing Database Connection")
    
    try:
        from database import AsyncSessionLocal, engine
        from sqlalchemy import text
        
        async with AsyncSessionLocal() as session:
            # Test connection
            result = await session.execute(text("SELECT 1"))
            if result:
                print_test("Database Connection", True, "Successfully connected to database")
                
                # Check tables
                result = await session.execute(text(
                    "SELECT name FROM sqlite_master WHERE type='table'"
                ))
                tables = [row[0] for row in result.fetchall()]
                print_test("Database Tables", True, f"Found tables: {', '.join(tables)}")
                return True
    except Exception as e:
        print_test("Database Connection", False, f"Error: {str(e)}")
        return False

async def test_crud_operations():
    """Test CRUD operations"""
    print_header("Testing CRUD Operations")
    
    try:
        from database import AsyncSessionLocal
        import crud
        import schemas
        
        async with AsyncSessionLocal() as session:
            # Test reading projects
            projects = await crud.get_projects(session)
            print_test("Read Projects", True, f"Found {len(projects)} projects")
            
            # Test reading services
            services = await crud.get_services(session)
            print_test("Read Services", True, f"Found {len(services)} services")
            
            # Test reading promotions
            promotions = await crud.get_promotions(session)
            print_test("Read Promotions", True, f"Found {len(promotions)} promotions")
            
            # Test reading site config
            config = await crud.get_site_config(session)
            print_test("Read Site Config", True, f"Found {len(config)} config items")
            
            return True
    except Exception as e:
        print_test("CRUD Operations", False, f"Error: {str(e)}")
        return False

async def check_bot_structure():
    """Check Telegram bot structure"""
    print_header("Checking Telegram Bot Structure")
    
    try:
        import bot
        
        # Check if key functions exist
        functions = [
            "start",
            "edit_content_start",
            "save_content",
            "manage_ads",
            "manage_projects",
            "start_add_proj",
            "receive_proj_title",
            "receive_proj_cat",
            "receive_proj_year",
            "receive_proj_loc",
            "receive_proj_img",
            "manage_services",
            "start_add_serv",
            "receive_serv_title",
            "receive_serv_desc",
            "receive_serv_icon",
            "start_add_ad",
            "receive_ad_title",
            "receive_ad_desc",
            "receive_ad_image",
            "receive_ad_discount",
            "cancel"
        ]
        
        for func_name in functions:
            if hasattr(bot, func_name):
                print_test(f"Bot function: {func_name}", True)
            else:
                print_test(f"Bot function: {func_name}", False, "Function not found")
        
        return True
    except Exception as e:
        print_test("Bot Structure Check", False, f"Error: {str(e)}")
        return False

async def main():
    """Main test runner"""
    print(f"\n{Colors.BOLD}{Colors.BLUE}")
    print("=" * 60)
    print("  Backend Verification Test Suite")
    print("  Testing all endpoints and functionality")
    print("=" * 60)
    print(f"{Colors.END}\n")
    
    # Run database tests
    await test_database_connection()
    await test_crud_operations()
    
    # Run API tests
    api_results = await test_api_endpoints()
    
    # Check bot structure
    await check_bot_structure()
    
    # Print summary
    print_header("Test Summary")
    print(f"{Colors.BOLD}API Endpoint Tests:{Colors.END}")
    print(f"  Total: {api_results['total']}")
    print(f"  {Colors.GREEN}Passed: {api_results['passed']}{Colors.END}")
    print(f"  {Colors.RED}Failed: {api_results['failed']}{Colors.END}")
    
    if api_results['failed'] == 0:
        print(f"\n{Colors.GREEN}{Colors.BOLD}✓ All tests passed!{Colors.END}\n")
    else:
        print(f"\n{Colors.RED}{Colors.BOLD}✗ Some tests failed. Please review.{Colors.END}\n")

if __name__ == "__main__":
    asyncio.run(main())
