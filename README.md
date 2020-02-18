# sqlite-runner
Used to send text files to Sqlite and open a file with the results. It just makes running sql queries a bit easier.

## Prerequisites

### Linux 

This only works on Linux.

### Nodejs

Node is needed. I use the [Node Version Manager](https://github.com/nvm-sh/nvm) (nvm) to install node.

Once nvm is installed, this installs the latest LTS (long term support) version of Node and the Node Package Manager (npm):

```bash
nvm install --lts
nvm ls
npm install npm -g
```

### Typescript 

This is written in Typescript so you need the compiler.

```bash
npm install -g typescript
```

### The sqlite-runner code and dependencies

To clone this code, go into a Linux terminal in the directory just above where you want the code to go.

```bash
git clone https://github.com/davidgma/sqlite-runner.git
cd sqlite-runner
npm install
npm update
chmod a+x compile
```

## Setting it up

### Compile the program
 
To compile the program, go into the sqlite-runner directory if you aren't already in it and run the compile script:

```bash
cd sqlite-runner
./compile
```

This should create a program run in the current directory and a set of files in the /build subdirectory.

You can try running the program without any options. It should print out the help for the program.

```bash
./run -h
```

### Test the program

You can manually test the run program using the test database.

```bash
./run "./test/test.sql" ./test stdout
```
The last line of output should be 'whisky|10'.

### Set up Geany

I use Geany to edit SQL files, but you could use some other program. If you use another program you'll have to modify the set-up based on that how that program configures build commands.

If you don't already have Geany, you can install it with:

```bash
sudo apt install geany
```

Open Geany and open an SQL file. You can use the file ./test/test.sql if you want, or any other SQL file (but the name should end in .sql so that Geany knows what to expect).

On the top menu, choose Build, Set Build Commands.

In the dialog box that pops up, click on the first box next to '1.' under 'SQL Commands'. Set the label to 'Send to Sqlite' or whatever text you want. On that row, in the next input box (under 'Command') put:

```
{pathToCode}/sqlite-runner/run %f %d localc
```

where pathToCode is the path to where you retrieved the code from Git. For example:

```
/home/david/local/dev/sqlite-runner/run %f %d localc
```

The localc at the end is the command for Libre Office Calc. You can put another program name instead if you want it to open up in another program. For example:

```
/home/david/local/dev/sqlite-runner/run %f %d kate
```

would open it up in the Kate text editor.

Then click on ok. Try sending the file to Sqlite by choosing the menu item Build, Send to Sqlite (F8).

## Usage

The text file you send is just a standard Sqlite sql file except for the following.

### Database name

So that the sqlite-runner program knows which database to send the sql code to, you must start the file with:

```
-- Database = databasePath
```

where databasePath is the path to the sqlite database you want to use. If the database is in another directory then include the full path. For example:

```
-- Database = test.db
```

or 

```
-- Database = /home/david/local/dev/sqlite-runner/test/test.db
```

You need to format it exactly as above, including the spaces.

### Substitution variables

If you have an sql statement that re-uses the same text often, or you want to have a variable that you can easily change, you can use the substitution variable functionality of sqlite-runner.

Sqlite-runner will simply substitute the variable name with the value in the rest of the sql statement. For example the following line in the file:

```
-- <variable name="<food_name>" value="whisky" />
```

will cause any instances of <food_name> in the rest of the sql to be replaced by the text whisky. See the test/test.sql for an example.
