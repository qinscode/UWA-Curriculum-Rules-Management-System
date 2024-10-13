#Required Packages and Imports
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class TestNavBar(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        #WebDriver settings
        chrome_options = Options()
        # chrome_options.headless = True
        chrome_service = Service('/usr/bin/chromedriver')  
        cls.driver = webdriver.Chrome(service=chrome_service, options=chrome_options)
        cls.driver.maximize_window()
        cls.driver.implicitly_wait(10)
        #Assigning Base URL
        cls.base_url = "http://localhost:6014"
        #Assigning login URL
        cls.login_url = "http://localhost:6014/login" 
    
    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()    

    def test_2nav_links(self):
        """Test that all navigation links are visible and functional."""
        
        #Getting login URL
        self.driver.get(self.login_url)

        #Locating required fields and feeding data
        self.driver.find_element(By.NAME, "email").send_keys("testuser@example.com")
        self.driver.find_element(By.NAME, "password").send_keys("password123")
        self.driver.find_element(By.TAG_NAME, "form").submit()
        WebDriverWait(self.driver, 10).until(EC.url_contains(self.base_url))

        # Test Home link
        #Locate the Home tab in the nav bar and assert if it is displayed
        home_link = self.driver.find_element(By.LINK_TEXT, "Home")
        self.assertTrue(home_link.is_displayed(), "Home link is not visible.")
        
        #Click on it and assert correct redirection
        home_link.click()
        self.assertIn(self.base_url, self.driver.current_url)

        # Test Manage Standard Rules link
        #Locate the Manage Standard Rules tab in the nav bar and assert if it is displayed
        rules_link = self.driver.find_element(By.LINK_TEXT, "Manage Standard Rules")
        self.assertTrue(rules_link.is_displayed(), "Manage Standard Rules link is not visible.")
        
        #Click on it and assert correct redirection
        rules_link.click()
        WebDriverWait(self.driver, 10).until(EC.url_contains("/manage-preset-course"))
        self.assertIn("/manage-preset-course", self.driver.current_url)

        # Test Manage Course link
        #Locate the Manage Course tab in the nav bar and assert if it is displayed
        course_link = self.driver.find_element(By.LINK_TEXT, "Manage Course")
        self.assertTrue(course_link.is_displayed(), "Manage Course link is not visible.")
        
        #Click on it and assert correct redirection
        course_link.click()
        WebDriverWait(self.driver, 10).until(EC.url_contains("/manage-course"))
        self.assertIn("/manage-course", self.driver.current_url)

        # Test Generate Documents link
        #Locate the Home tab in the nav bar and assert if it is displayed
        generate_link = self.driver.find_element(By.LINK_TEXT, "Generate Documents")
        self.assertTrue(generate_link.is_displayed(), "Generate Documents link is not visible.")
        
        #Click on it and assert correct redirection
        generate_link.click()
        WebDriverWait(self.driver, 10).until(EC.url_contains("/generate-documents"))
        self.assertIn("/generate-documents", self.driver.current_url)
    
    def test_1signIn_register_buttons(self):
        """Test the visibility and functionality of login and logout buttons."""
        
        #Getting Base URL
        self.driver.get(self.base_url)

        #Locate the login tab in the nav bar and assert if it is displayed
        login_button = self.driver.find_element(By.LINK_TEXT, "Sign In")
        self.assertTrue(login_button.is_displayed(), "Sign In button is not visible.")
        
        #Click on it and assert correct redirection
        login_button.click()
        WebDriverWait(self.driver, 10).until(EC.url_contains("/login"))
        self.assertIn("/login", self.driver.current_url)

        #Getting Base URL
        self.driver.get(self.base_url)

        #Locate the Register tab in the nav bar and assert if it is displayed
        register_button = self.driver.find_element(By.LINK_TEXT, "Register")
        self.assertTrue(register_button.is_displayed(), "Register button is not visible.")
        
        #Click on it and assert correct redirection
        register_button.click()
        WebDriverWait(self.driver, 10).until(EC.url_contains("/register"))
        self.assertIn("/register", self.driver.current_url)

    def test_3profile_logout_buttons(self):
        """Test that Profile link shows up on the navbar after logging in."""
        #Commented because this run after test_2nav_links() which ends with the login data still present
        '''self.driver.get(self.login_url)
        self.driver.find_element(By.NAME, "email").send_keys("testuser@example.com")
        self.driver.find_element(By.NAME, "password").send_keys("password123")
        self.driver.find_element(By.TAG_NAME, "form").submit()
        WebDriverWait(self.driver, 10).until(EC.url_contains(self.base_url))
        '''
        #Getting Base URL
        self.driver.get(self.base_url)

        #Locate the Profile tab in the nav bar and assert if it is displayed
        profile_link = self.driver.find_element(By.LINK_TEXT, "Profile")
        self.assertTrue(profile_link.is_displayed(), "Profile link is not visible after login.")
        
        #Click on it and assert correct redirection
        profile_link.click()
        WebDriverWait(self.driver, 10).until(EC.url_contains("/profile"))
        self.assertIn("/profile", self.driver.current_url, "Failed to navigate to the Profile page.")

        #Locate the Logout tab in the nav bar and assert if it is displayed
        logout_link = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Logout')]")
        self.assertTrue(logout_link.is_displayed(), "Logout link is not visible after login.")
        
        #Click on it and assert correct redirection
        logout_link.click()
        WebDriverWait(self.driver, 10).until(EC.url_contains(self.base_url))
        self.assertIn(self.base_url, self.driver.current_url, "Failed to Log out.")

if __name__ == "__main__":
    unittest.main()
