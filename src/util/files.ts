const fs = require("fs")
const path = require("path")

export const getAllFiles = function(dirPath: string, depth: number = -1, array?: any[]) {


  var files = fs.readdirSync(dirPath)

  var arrayOfFiles = array || []

  if (depth == 0) return arrayOfFiles;

  files.forEach(function(file: any) {

    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, depth - 1, arrayOfFiles)
    } else {
      arrayOfFiles.push(dirPath + "/" + file)
    }
    
  })

  return arrayOfFiles
}