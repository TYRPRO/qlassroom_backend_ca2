
# Guide to postgresql

Hello there, we are now using Postgresql instead of MySQL! There are a few notable changes:

## Different Datatypes
Changes will be shown from mysql from the left and postgresql on the right:
```
tinyint => boolean
timestamp => timestamp with timezone/timestamp without timezone
varchar(value) => character varying
```
More on character varying and how to declare it's length later in the Pgadmin guide

We also used to use an auto increment integer for our primary keys. This is now replaced with:
```
int => uuid
```

There's also a datatype named
```
text
```
Which is basically varchar but with an extrememly long limit (about 1GB's worth)

There's also an additional array datatype for every other datatype. Kinda like how Java has String, and for array it's String[]

Postgresql has text[], boolean[], character varying[], etc.

### Default Values in Postgresql
Default value will be shown on the left and the default value on the right (datatype => default_value):
```
uuid => uuid_generate_v4()
timestamp => CURRENT_TIMESTAMP
any_string_datatype => 'text_here_with_single_quotes_and_single_quotes_only'
```
uuid_genereate_v4() generates a unique ID for the column.

# Guide to Pgadmin V4

## Installation
Head over to [Pgadmin 4's Windows download page](https://www.postgresql.org/ftp/pgadmin/pgadmin4/v6.4/windows/) and download the Windows version (I assume no one here is on other OSes, but if you are download your respective version). The latest version as of this writing is V6.4. Click on the exe on the site to start downloading it.

Run the installer and then open the application (can be found in the start menu)

## Connecting to ElephantSQL Online Database
Upon startup, you should see this:  
![image](https://user-images.githubusercontent.com/87083745/149625483-576d187b-01dd-492b-b5e5-1b226489e1a3.png)

DO NOT SKIP THIS STEP! If you do skip this step, you will not be able to connect to a database. Although you are given the option to click cancel please don't, and make a master password.

Once you key in your master password, click on "Add new server":  
![image](https://user-images.githubusercontent.com/87083745/149625560-0d5e23a6-6f8e-47ed-8a28-fcc09d20bda8.png)

You'll be promted to fill in the following:  
Server Name (Can be anything)  
![image](https://user-images.githubusercontent.com/87083745/149625580-97eb8ce6-f2a8-4f99-a600-63ed08ee3229.png)

Server connection details:  
![image](https://user-images.githubusercontent.com/87083745/149625618-3238fce1-96c0-413c-9420-40d43c78f11e.png)

**Please get your connection details from whoever set up the database.**

Fill in the Hostname, Maintenance Database, Username and Password. In elephantSQL's case, Maintenance Database and Username are the same:  
![image](https://user-images.githubusercontent.com/87083745/149625716-66cedab8-162f-4d16-8122-3ca6a7f3533a.png)

Click on save and you are done!

## Accessing Database
Access your database on the left side panel:  
![image](https://user-images.githubusercontent.com/87083745/149625782-ac488b14-22a0-4a9b-aaea-d26e55d5c6af.png)

Keep scrolling down until you see your database:  
![image](https://user-images.githubusercontent.com/87083745/149625808-87c9a090-6d6c-4040-a294-e78061ebe9b6.png)

## Create a new schema:
Right click on Schemas under your database and click on Create > Schema:  
![image](https://user-images.githubusercontent.com/87083745/149625866-c7f9ef6c-bb4a-4cc1-b70e-c45bd87246bd.png)

Enter a schema name and click save.

## Setting schema as default schema
When you use ElephantSQL, it might default to the public schema. If you want the sql query to go to the right schema, you have to set it as a default:  
1. Right click on any table and click on Query Tool:  
![image](https://user-images.githubusercontent.com/87083745/149628520-61b057ae-4b48-47b4-b43e-5b16622bb7e3.png)

2. Enter this line of query:
> ALTER ROLE your_role SET search_path = my_schema, "$user", public;

Where your_role is ElephantSQL's database username, my_schema is your schema name, and "$user" is also your database username (replace _user_ and retain the dollar sign as well as the double quotes).  
3. Execute the query by clicking on the play button:  
![image](https://user-images.githubusercontent.com/87083745/149628659-3fd6aadc-0848-4262-b272-ef9a0767afd3.png)


## Creating a table within a schema
Under your newly created schema, right click on Tables, then click Create > Table:  
![image](https://user-images.githubusercontent.com/87083745/149625927-763e8c09-2d0a-4ac7-b5dc-c250be0ec702.png)

Enter your table name:  
![image](https://user-images.githubusercontent.com/87083745/149625939-e81a3745-499c-47f9-b02f-7390a2b145a4.png)

Click on the columns tab to add columns to the table. There is a plus sign on the right to create a new column.  
![image](https://user-images.githubusercontent.com/87083745/149625973-7f905944-c860-4969-8189-7fc41e9f2429.png)

After creating a new column, you can edit the column name, its data type, NOT NULL, PRIMARY KEY and default value:  
![image](https://user-images.githubusercontent.com/87083745/149626571-fcacf5ec-4545-40bf-8403-b79648c5f0e1.png)
In the image shown above, character varying is equivalent to varchar in mysql, but the size of the varchar is to be declared under the Length/Precision field, next to the data type.
Do remember that for default values:
1. UUID uses
```
uuid_generate_v4()
```
2. Timestamp with local zone uses
```
CURRENT_TIMESTAMP
```
3. Any string default values use single quotes to enclose the string, like 'male', 'admin', etc.

## Foreign Keys
Under the Contraints tab, go to the Foreign Keys sub-tab. You should see a plus button on the right to add a new contraint:  
![image](https://user-images.githubusercontent.com/87083745/149626131-4ad432f0-52dd-4d1a-8d66-a901252a86ad.png)

Steps to add a Foreign Key Contraint:
1. Click on the + button
2. Enter the name of the contraint (Can be anything, but make sure it is meaningful.)
3. Click on the pencil on the same row to the left, next to the bin:  
![image](https://user-images.githubusercontent.com/87083745/149626196-d41aa9fc-24d2-4594-b4a3-d9d935e776a8.png)
4. Click on the Columns tab and select the foreign key in the table, followed by the table it references, followed by the column of said reference table. Then click on Add:  
![image](https://user-images.githubusercontent.com/87083745/149626242-9aae1e54-3d33-4882-9d86-29d58b0cb56d.png)
5. Then go to the actions tab under the edit panel and set the actions for ON UPDATE and ON DELETE:  
![image](https://user-images.githubusercontent.com/87083745/149626286-a5e8b943-79d7-4d86-9816-f9b599d6b4ff.png)

**NOTES**  
**1: Once you add a Contraint and you save the Table changes, you _CANNOT_ edit ON UPDATE and ON DELETE actions anymore. If you wish to edit them, delete the existing Contraint for that column and then make a new Contraint**  
**2: If you are trying to do a self-referencing Constraint, create the table first, then edit the table to have a self-referencing Constraint. Not doing so will result in pgAdmin not showing the table you are trying to self-reference as Pgadmin doesn't see it as an existing table.**  
**3: pgAdmin will not allow you to add multiple Contraints that are from different tables at one go. E.g A column references the User table and another column references the Subforum table. If you add a Contraint with an FK referencing the User table, you need to save the table, go back to the table properties and then re-add another FK Contraint referencing the Subforum table.**

## Editing a table's properties (columns, contraints, etc)
Right click on the table and click Properties:  
![image](https://user-images.githubusercontent.com/87083745/149626492-34a25168-b0a3-462a-9588-6c509b0ce270.png)

## Editing a table's values:
Right click on the table and click View/Edit Data, followed by the number of rows you want:  
![image](https://user-images.githubusercontent.com/87083745/149626516-06a01b18-2941-4ef7-96d1-83a66b768b2e.png)


## End
If you have any questions, feel free to ask Adam.
