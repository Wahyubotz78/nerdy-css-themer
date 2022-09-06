# nerdy-css-themer
A tool to extract CSS colors and easily theme the website


## Features
- Removes everything that does not affect colors
- Extracts all the colors to variables under `:root` for easier editing
- Makes the new colors and rules `!important` for easier injection
- To be used with combination with Chrome extensions

## How To
- Find a website to recolor
- Download the css file
- Import the module
> You can also just use the `npm run test` if you wanna quickly modify the file
- Modify the `.css` file
- Edit the colors to your liking in the newly generated stylesheet
> You can inject stylesheets in Chrome extensions and make some cool skins

## Depolyment

- Clone the Repository
- Install Node and NPM if not installed
- Install NPM packages by running `npm install`
- Ready to go

## Demo
> Run `npm run test` and see the `nerdy-css-themer/test/out` directory. It will contan new and old versions of both CSS and AST files. AST is there just for learning and demo purposes.