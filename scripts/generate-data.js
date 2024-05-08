const fs = require('fs')
const path = require('path')
const { rimrafSync } = require('rimraf')

const sourceDirectory = path.join(__dirname, '../app/data/seed')
const destinationDirectory = path.join(__dirname, '../app/data/dist')

const copy = (source, destination) => {
  if (!fs.existsSync(destinationDirectory)) {
    console.log('Creating directory: ' + destinationDirectory)
    fs.mkdirSync(destinationDirectory)
  }

  const list = fs.readdirSync(source)
  let sourceFile, destinationFile

  list.forEach((file) => {
    sourceFile = source + '/' + file
    destinationFile = destination + '/' + file

    const stat = fs.statSync(sourceFile)
    if (stat && stat.isDirectory()) {
      try {
        console.log('Creating directory: ' + destinationFile)
        fs.mkdirSync(destinationFile)
      } catch (e) {
        console.log('Directory already exists: ' + destinationFile)
      }
      copy(sourceFile, destinationFile)
    } else {
      try {
        if (!destinationFile.includes('.gitkeep') && !destinationFile.includes('README.md')) {
          console.log('Copying file: ' + destinationFile)
          fs.writeFileSync(destinationFile, fs.readFileSync(sourceFile))
        }
      } catch (e) {
        console.log('Could’t copy file: ' + destinationFile)
      }
    }
  })
}

const remove = (destination) => {
  console.log('Removing directory: ' + destination)
  rimrafSync(destination)
}

remove(destinationDirectory)

copy(sourceDirectory, destinationDirectory)

/// ------------------------------------------------------------------------ ///
/// Environment variables
/// ------------------------------------------------------------------------ ///

// Create template .env file if it doesn't exist
const envExists = fs.existsSync(path.join(__dirname, '../.env'))

if (!envExists) {
  fs.createReadStream(path.join(__dirname, '../lib/template.env'))
    .pipe(fs.createWriteStream(path.join(__dirname, '../.env')))
}
