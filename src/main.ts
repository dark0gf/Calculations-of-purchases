const fs = require("fs");
import logger from './logger';
import UsersProcessor from './users.processor';

(() => {
  const folderToProcess = process.argv.pop();
  if (!fs.existsSync(folderToProcess)) {
    logger.error(`folder ${folderToProcess} does not exists`);
    return;
  }

  const userProcessor = new UsersProcessor();

  logger.info(`processing folder ${folderToProcess}`);
  fs.readdirSync(folderToProcess).forEach(file => {
    const fullPathFile = folderToProcess + file;

    let data;
    try {
      const content = fs.readFileSync(fullPathFile, 'utf-8');
      data = JSON.parse(content);
    } catch (e) {
      logger.error(`Failed to process file: ${fullPathFile}`, e);
      return;
    }
    userProcessor.add(data);
  });

  logger.info(`result ${JSON.stringify(userProcessor.getResult(), null, 4)}`);

})();
