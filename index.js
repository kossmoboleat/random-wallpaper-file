const wallpaper = require('wallpaper');
const fs = require('fs');
const path = require('path');

//Grabs a random index between 0 and length
function randomIndex(length) {
  return Math.floor(Math.random() * (length));
}

function getRandomImages(imageDir, numberOfFiles) {
  //Read the directory and get the files
  const dirs = fs.readdirSync(imageDir)
  .filter(fileName =>
      fileName.toLowerCase().endsWith("png") ||
      fileName.toLowerCase().endsWith("jpg") ||
      fileName.toLowerCase().endsWith("jpeg"))
  .map(file => path.join(imageDir, file));

  const chosenImages = [];
  const hashCheck = {}; //used to check if the file was already added to chosenImages

  //While we haven't got the number of files we want. Loop.
  while (chosenImages.length < numberOfFiles) {
    const fileIndex = randomIndex(dirs.length - 1);

    //Check if the file was already added to the array
    if (hashCheck[fileIndex] === true) {
      continue; //Already have that file. Skip it
    }

    //Add the file to the array and object
    chosenImages.push(dirs[fileIndex]);
    hashCheck[fileIndex] = true;
  }

  return chosenImages;
}

const main = async () => {
  const imageDir = process.argv[2];
  if (!imageDir) {
    console.error('Please specify image directory as argument!');
    return;
  }

  const numberOfScreens = (await wallpaper.screens()).length;

  const randomImages = getRandomImages(imageDir, numberOfScreens);

  for (const filePath of randomImages) {
    const screenIndex = randomImages.indexOf(filePath);
    console.log(screenIndex, filePath);
    await wallpaper.set(filePath, {screen: screenIndex});
  }
};

main()
.then(() => {
})
.catch((e) => {
  console.error('main()', e);
});
