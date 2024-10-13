#Required Packages and Imports
import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions as EC

class TestCourseManagePage(unittest.TestCase):

    @classmethod
    def setUp(cls):
        #WebDriver settings
        chrome_options = Options()
        # chrome_options.headless = True
        chrome_service = Service('/usr/bin/chromedriver')  
        cls.driver = webdriver.Chrome(service=chrome_service, options=chrome_options)
        cls.driver.maximize_window()
        cls.driver.implicitly_wait(10)
        #Assigning Base URL
        cls.base_url = "http://localhost:6014/manage-course" 
        #Assigning login URL
        cls.login_url = "http://localhost:6014/login"  
        #Getting login URL 
        cls.driver.get(cls.login_url)
        #Locating required fields and feeding data
        cls.driver.find_element(By.NAME, "email").send_keys("testuser@example.com")
        cls.driver.find_element(By.NAME, "password").send_keys("password123")
        cls.driver.find_element(By.TAG_NAME, "form").submit()
        #Wait until Base URL is loaded
        WebDriverWait(cls.driver, 10).until(EC.url_contains(cls.base_url))

    @classmethod
    def tearDown(cls):
        cls.driver.quit()

    def test_page_load(self):
        """Test that the CourseManage page loads correctly after login."""

        #Locating h1 element
        header = self.driver.find_element(By.TAG_NAME, 'h1').text

        #Asserting if the element contains the correct text
        self.assertIn("Choose a Course", header)


    def test_create_new_course(self):
        """Test creating a new course after login."""

        #Locating the Create New Course Button and Clicking on it
        self.driver.find_element(By.XPATH, "//button[contains(text(), 'Create New Course')]").click()

        #Locating and feeding required data
        self.driver.find_element(By.ID, 'code').send_keys("TEST101")
        self.driver.find_element(By.ID, 'name').send_keys("Test Course")
        self.driver.find_element(By.ID, 'version').send_keys("2024")

        #Locating dropdown and clicking on it
        course_type_dropdown = self.driver.find_element(By.XPATH, "//*[@id='radix-:r2:']/div[2]/div[3]/button")
        course_type_dropdown.click()

        #Initialising action variable
        action = ActionChains(self.driver)
        #Locating and selecting Graduate Certificate 
        action.send_keys(Keys.ENTER).perform()

        #Locating the Create Course button and Clicking on it
        self.driver.find_element(By.XPATH, "//button[contains(text(), 'Create Course')]").click()

        #Wait for Success message
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//div[contains(text(), 'Course Created')]"))
        )
        time.sleep(2)

        #Assert if the course has been created
        course_list = self.driver.find_element(By.XPATH, "//table").text
        self.assertIn("Test Course", course_list)

    def test_add_version(self):
        """Test adding a new version to a course."""

        #Locating + button of the last course in the table and clicking on it
        add_version_button = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/main/div/div/div/div[2]/div/div/table/tbody/tr[last()]/td[4]/div/button[2]")
        add_version_button.click()

        #Locating and feeding data
        new_version_field = self.driver.find_element(By.ID, 'new-version')
        new_version_field.send_keys("2026")

        #Locating Save button andd clicking on it
        save_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Save')]")
        save_button.click()

        #Locating X button and clicking on it
        close_button = self.driver.find_element(By.XPATH, "//button[contains(@class, '[state=open]:text-muted-foreground')]")
        close_button.click()

        #Assert if the new version has been added
        time.sleep(1)
        span_text = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/main/div/div/div/div[2]/div/div/table/tbody/tr[last()]/td[4]/div/button[1]/span").text
        self.assertIn("2026", span_text)
    
    def test_search_course(self):
        """Test searching for a course after login."""

        #Locating the Search box and feeding data into it
        search_field = self.driver.find_element(By.XPATH, "//input[@placeholder='Search courses...']")
        search_field.send_keys("Test Course")
        search_field.send_keys(Keys.RETURN)

        #Assert the search results
        time.sleep(1)
        search_result = self.driver.find_element(By.XPATH, "//table").text
        #Ensure only Test Course shows
        self.assertIn("Test Course", search_result)
        self.assertNotIn("Information Technology", search_result)


    def test_filter_by_type(self):
        """Test filtering courses by type using the filter dropdown."""

        #Locating Filter by type dropdown and clicking on it
        filter_dropdown = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/main/div/div/div/div[1]/button[2]")
        filter_dropdown.click()

        #Traversing using keyboard and selecting the required course type
        action = ActionChains(self.driver)
        action.send_keys(Keys.ARROW_DOWN).perform()
        action.send_keys(Keys.ARROW_DOWN).perform()
        # Choosing Master's (Coursework)
        action.send_keys(Keys.ENTER).perform()

        #Assert the Filter results
        time.sleep(1)
        course_list = self.driver.find_element(By.XPATH, "//table").text
        self.assertIn("Master's (Coursework)", course_list)
        self.assertNotIn("Doctoral Degree", course_list)

    def test_edit_button(self):
        """Test clicking the edit button for a course."""

        #Locating edit button and click on it
        edit_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Edit')]")
        edit_button.click()

        #Wait for correct page redirection
        WebDriverWait(self.driver, 10).until(EC.url_contains("/manage-rules"))

        #Assert the page redirection
        current_url = self.driver.current_url
        self.assertIn("/manage-rules", current_url)
        self.assertIn("code=", current_url)
        self.assertIn("version=", current_url)

    def test_zdelete_course(self):
        """Test deleting a course after login."""

        #locate the delete button of the last course in the table and click on it
        delete_button = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/main/div/div/div/div[2]/div/div/table/tbody/tr[last()]/td[5]/div/button[2]")
        delete_button.click()

        #Wait for Delte button to appear and click on it
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//button[contains(text(), 'Delete')]"))
        ).click()

        #Wait for Deleted message
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//div[contains(text(), 'Course deleted')]"))
        )
        
        #Assert Test Course not in table
        time.sleep(2)
        course_list = self.driver.find_element(By.XPATH, "//table").text
        self.assertNotIn("Test Course", course_list)

if __name__ == "__main__":
    unittest.main()
    