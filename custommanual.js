/**
 * @fileoverview CUSTOM MANUALS
 * A tui to create custom manuals for your commands
 * Copyright (c) 2023 Spencer Boggs 
 * 
 * ▞▀▖▌ ▌▞▀▖▀▛▘▞▀▖▙▗▌ ▙▗▌▞▀▖▙ ▌▌ ▌▞▀▖▌  ▞▀▖
 * ▌  ▌ ▌▚▄  ▌ ▌ ▌▌▘▌ ▌▘▌▙▄▌▌▌▌▌ ▌▙▄▌▌  ▚▄ 
 * ▌ ▖▌ ▌▖ ▌ ▌ ▌ ▌▌ ▌ ▌ ▌▌ ▌▌▝▌▌ ▌▌ ▌▌  ▖ ▌
 * ▝▀ ▝▀ ▝▀  ▘ ▝▀ ▘ ▘ ▘ ▘▘ ▘▘ ▘▝▀ ▘ ▘▀▀▘▝▀ 
 */


// Function to display the main menu
function displayMenu() {
    // Locate or create a manual folder
    var fs = require('fs');
    var path = require('path');
    var dir = path.join(__dirname, 'manuals');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    process.chdir(dir);

    // Display the main menu of the tui
    console.log("\033[1mMAIN MENU\033[0m")
    console.log("1. Add a new manual");
    console.log("2. View all manuals");
    console.log("3. Exit");
}

// Function to add a new manual
function addManual() {
    // Display the menu to create a new manual
    console.log("")
    console.log("\033[1mCREATE A NEW MANUAL\033[0m");
    console.log("(Enter nothing to cancel)");

    // Create a new file with the users input
    var readline = require('readline-sync');
    console.log("")
    var manualName = readline.question("Enter the name of the manual: ");
    var fileName = manualName + ".txt";

    // If the user enters nothing then cancel the operation
    if (manualName == "") {
        // Reset the program
        resetScreen();
        run();
        return;
    }

    // Add the file to the folder if it doesn't already exist
    var fs = require('fs');
    if (fs.existsSync(fileName)) {
        // If the file exists then inform the user
        resetScreen();
        console.log("\033[2A");
        console.log("\033[31mThe manual: '" + manualName + "' already exists\033[0m");
        // Let the user try again
        addManual();
    } else {
        // If the file does not exist then create it
        fs.writeFileSync(fileName, manualName);
        resetScreen();
        console.log("\033[2A");
        var path = require('path');
        var filePath = path.resolve(`./${fileName}`)
        console.log("Manual created at: " + filePath);
        // Let the user add to the file
        run();
    }
}

// Function to view all manuals
function viewManuals() {
    // Get all of the files inside of the manuals folder
    var fs = require('fs');
    var files = fs.readdirSync(".");

    // Check to see if the files exist
    if (files.length == 0) {
        // If there are no files tell the user
        resetScreen();
        console.log("\033[2A");
        console.log("\033[31mNo manuals have been added yet\033[0m");
        // Keep the user on the main menu screen
        run();
        return;
    }

    // If there are files move the user to the list
    resetScreen();
    console.log("");
    console.log("\033[1mLIST OF MANUALS\033[0m")
    console.log("(Enter nothing to cancel)");
    console.log("")

    // Get all of the files from the folder and number them
    for (var i = 0; i < files.length; i++) {
        console.log((i + 1) + ". " + files[i]);
    }

    // Prompt the user to select a file
    var readline = require('readline-sync');
    console.log("");
    var choice = readline.question("Enter the number of the manual you want to edit/read: ");
    if (choice == "") {
        resetScreen();
        run();
        return;
    }

    // Check if the choice is in the list
    if (choice < 1 || choice > files.length) {
        // If the user selects an invalid number tell them the file does not exist
        resetScreen();
        console.log("\033[2A");
        console.log("\033[31mInvalid choice\033[0m");
        viewManuals();
        return;
    }

    // If the file does exist display the options menu
    resetScreen();
    var fileName = files[choice - 1];
    function editFile() {
        console.log("")
        console.log("Choose what to do with " + fileName);
        console.log('1. Read file');
        console.log('2. Edit file');
        console.log('3. Delete file');
        console.log('4. Back');

        // Let the user select what they want to do with the file
        var selectedOption = readline.question("Enter your choice: ")

        // If they select option 1 display the file content
        if (selectedOption == '1') {
            // Reset the screen and display the content of the file
            resetScreen();
            console.log("")
            console.log("Content of: " + fileName)
            console.log("")
            var data = fs.readFileSync(fileName, 'utf8');
            console.log(data.toString())
            console.log("")

            // Ask if the user wants to view another file
            var back = readline.question("Would you like to edit another file (y/n)? ")
            resetScreen();

            // If they do go back to the file selection screen
            if (back == 'n') {
                run();
            } else {
                viewManuals();
            }
        }

        // If they select option 2 open the file in vscode
        if (selectedOption == '2') {
            const execSync = require('child_process').execSync;
            execSync(`code ${fileName}`, { encoding: 'utf-8' });
        }

        // If they select option 3 delete the file
        if (selectedOption == '3') {
            // Confirm the the user wants to delete the file
            console.log("\033[2A");
            var confirm = readline.question("\033[31mAre you sure you would like to delete " + fileName + " (y/n)? \033[0m");

            // If they confirm then delete the file
            if (confirm == 'y') {
                fs.unlinkSync(fileName)
                console.log("");
                console.log("\033[31m" + fileName + " deleted! \033[0m");
                setTimeout(function () {
                    resetScreen();
                    viewManuals();
                }, 1500);
            } else {
                resetScreen();
                editFile();
            }
        }

        // If they select option 4 then return to the file selection menu
        if (selectedOption == '4') {
            resetScreen();
            viewManuals();
        }
    }

    // Display the file options menu
    editFile();
}

// Function to run the program
function run() {
    // Ask the user what they want to do
    console.log("");
    displayMenu();
    var readline = require("readline-sync");
    var choice = readline.question("Enter your choice: ")

    // If they choose 1 display the add manual menu
    if (choice == 1) {
        resetScreen();
        addManual();

        // If they select 2 display the manual list
    } else if (choice == 2) {
        viewManuals();

        // If they select 3 exit the program
    } else if (choice == 3 || choice == "") {
        console.log("");
        // display the message in red
        console.log("\033[31mExiting...\033[0m");
        setTimeout(function () {
            console.log("\033[1A");
            console.log('\033c');
        }, 500);

        // If they don't select a valid option tell them
    } else if (choice != 3 && choice != "") {
        resetScreen();
        console.log("\033[2A");
        console.log("\033[31mInvalid choice. Please try again.\033[0m");
        run();
    }
}


// Function to reset the screen
function resetScreen() {
    console.log('\033c');
    console.log('\033[2J');
    console.log('\033[0;0f');
    console.log("\033[34m");
    console.log("▞▀▖▌ ▌▞▀▖▀▛▘▞▀▖▙▗▌ ▙▗▌▞▀▖▙ ▌▌ ▌▞▀▖▌  ▞▀▖");
    console.log("▌  ▌ ▌▚▄  ▌ ▌ ▌▌▘▌ ▌▘▌▙▄▌▌▌▌▌ ▌▙▄▌▌  ▚▄ ");
    console.log("▌ ▖▌ ▌▖ ▌ ▌ ▌ ▌▌ ▌ ▌ ▌▌ ▌▌▝▌▌ ▌▌ ▌▌  ▖ ▌");
    console.log("▝▀ ▝▀ ▝▀  ▘ ▝▀ ▘ ▘ ▘ ▘▘ ▘▘ ▘▝▀ ▘ ▘▀▀▘▝▀ ");
    console.log("\033[0m");
    console.log("by Spencer Boggs");
}

// Run the program
resetScreen();
run();