from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Set up WebDriver (Assuming Chrome)
driver = webdriver.Chrome()

# Define URL of the web application
url = 'http://localhost:3000/manage-course'  # Update if the port differs

# Navigate to the URL
driver.get(url)

# Set up explicit wait
wait = WebDriverWait(driver, 10)

# Log in as Admin (if login is required)
# Assuming user login is required, here is how you can locate the login elements:
# wait.until(EC.presence_of_element_located((By.ID, 'email'))).send_keys("admin@example.com")
# wait.until(EC.presence_of_element_located((By.ID, 'password'))).send_keys("password123")
# wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Log In')]"))).click()

# Wait for the page to load and locate the "Create New Standard Rules" button
create_button = wait.until(
    EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Create New Standard Rules')]"))
)

# Click the "Create New Standard Rules" button to open the dialog
create_button.click()

# Fill in the course creation form
wait.until(EC.presence_of_element_located((By.ID, 'code'))).send_keys('TEST101')
wait.until(EC.presence_of_element_located((By.ID, 'version'))).send_keys('2024')

# Select course type from the dropdown
course_type_dropdown = wait.until(EC.element_to_be_clickable((By.XPATH, "//div[contains(@class, 'SelectTrigger')]")))
course_type_dropdown.click()

course_type_option = wait.until(EC.element_to_be_clickable((By.XPATH, "//div[contains(text(), 'Master\'s (Coursework)')]")))
course_type_option.click()

# Submit the form to create the course
submit_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Create Standard Rules')]")))
submit_button.click()

# Verify that the course has been added
wait.until(EC.presence_of_element_located((By.XPATH, "//td[contains(text(), 'TEST101')]")))

# Perform a search operation for the new course
search_input = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Search courses...']")))
search_input.send_keys('TEST101')
search_input.send_keys(Keys.RETURN)

# Verify that the search results contain the new course
assert "TEST101" in driver.page_source

# Simulate clicking the delete button for the course
delete_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'hover:bg-red-100')]")))
delete_button.click()

# Confirm deletion in the dialog
confirm_delete_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Delete')]")))
confirm_delete_button.click()

# Verify that the course is no longer in the
