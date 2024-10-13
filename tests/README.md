# Automated App Functionality Testing

## Testing pre-requisites

* Test cases were written in `python` and built using `Selenium`.

* To install python3, run the following commands:

~~~bash
sudo apt update
sudo apt install python3
sudo apt install python3-pip
~~~

* To install Selenium, run the following command:

~~~bash
pip install selenium
~~~

* The test cases were executed on a `Chrome` browser, so [download](https://www.google.com/intl/en_au/chrome/dr/download/?brand=SLLM&ds_kid=43700079019569752&gad_source=1&gclid=EAIaIQobChMIsL64nLb5iAMVqyF7Bx2xPgj0EAAYASAAEgIlvfD_BwE&gclsrc=aw.ds) and install the latest Chrome browser or if already installed, update to the latest version.

* To run tests, `ChromeDriver` is required.

* Download ChromeDriver from [here](https://googlechromelabs.github.io/chrome-for-testing/).

* Use this [link](https://gist.github.com/siumhossain/1aa24622d8fda5053581c87ca6457638) to set up ChromeDriver.

* Make sure in the **test files**, the full path of the ChromeDriver is specified in the `chrome_service` variable. (In my case, the path to the `chromedriver` is `/usr/bin/chromedriver`)

## Running tests

* Before running tests, the app must be running (both frontend and backend). To know how to run the app refer to the main `README` file.

* It is recommended to use `pytest`, as it more descriptive of the test results.

* If you want to use `pytest`, install it first:

~~~bash
pip install pytest
~~~

* Then to run all the test files, use the following command:

~~~bash
pytest tests/
~~~

*Note: This would run all the test files present in the folder `tests/`.*

* If you are already in the test directory, use the following command to run all the tests:

~~~bash
pytest
~~~

* If you want to run only a specific test file, specify that file name:

~~~bash
pytest <file_name>
~~~

* For example, to test the register page, the command is:

~~~bash
pytest test_register.py
~~~

* Alternatively, you can run the tests using `python3`:

~~~bash
python3 <file_name>
~~~

* For example, to test the login page, the command is:

~~~bash
python3 test_login.py
~~~

