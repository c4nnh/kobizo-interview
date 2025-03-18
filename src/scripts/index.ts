import "dotenv/config";
import { createSystemUser } from "./create-system-user";
import { getArguments } from "./utils";

async function triggerScript() {
  const { script } = getArguments();

  console.info(`Running script: ${script}`);

  switch (script) {
    case "create-system-user": {
      await createSystemUser();
      break;
    }
    default: {
      console.warn("Script name is invalid");
    }
  }
}

triggerScript()
  .then()
  .catch((error) => console.error(error));
