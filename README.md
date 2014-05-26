za-school-results
***************************************************

Visualization of matric pass rates for South Africa
***************************************************

****************************************
CLONING THE REPOSITORY
****************************************
1. Assuming that you have a GitHub account and that you have been added to the project
2. Create a folder for your project - mkdir 'foleder_project_name'
3. cd foleder_project_name
4. git clone git@github.com:HendrikLouw/za-school-results.git

****************************************
INSTRUCTIONS FOR INSTALLING REQUIREMENTS
****************************************
1. brew install rbenv - Ruby package manager
2. rbenv install (ruby-2.1.0) - Not necessary to mention the ruby version, will install latest if not specified
3. Verify that 'mongodb' is installed on your machine, otherwise install it by running
4. brew install mongodb
5. If you get this 'ERROR: dbpath (/data/db) does not exist' then run
6.'sudo mkdir -p /data/db/
7. mongod & - To start mongo
8. mongo - To verify that mongo is well installed
9. If you get this 'exception: connect failed' then run
10. sudo mongod &
 
***********************************
INSTRUCTIONS FOR SETTING UP THE APP
***********************************
1. cd frontend - To go to the 'frontend' folder
2. npm install
3. cd .. - go back to the project 'za_schools_web' folder
4. brew install leiningen - for clojure build automation (tasks runner in clojure  it is like pip in python)
5. brew install neo4j' - For the awesome graph DB
6. lein run
7. cd parse_csv
8. lein run
9. copy this piece of code:
#========================================
export IRON_CACHE_PROJECT_ID=528b6f7b0defc2000500003e
export IRON_CACHE_TOKEN=jYjlTGHvW2QMhm1-0HKk2QyDCCs
export MONGOHQ_URL="mongodb://localhost:27017/za_schools"
#========================================
10. paste the above piece of code in '.bash_profile' file (vi ~/.bash_profile)
11. source ~/.bash_profile
12. lein run
13. cd frontend
14. Verify that you have npm installed, otherwise run
15. brew install npm - npm stands for node package manager
16. install npm  - this command looks at 'package.json' file in your code base and install all requirements and dependencies

17. npm install -g bower - bower is a package manager for Javascript
18. bower install
19. No - choose this option
20. npm install -g grunt
21. grunt --force' - this command compiles the application - don't worry about the warnings.
22. bundle gem list - to verify that bundler is installed, otherwise run
23. gem install bundler'
24. gem list' to ckeck whether you have the following:
bundler (1.6.2)
25. bundle install

