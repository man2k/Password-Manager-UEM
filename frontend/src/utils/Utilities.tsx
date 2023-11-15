import { toast } from "react-toastify";
import { clipboard } from "@neutralinojs/lib";
export const generatePassword = (length: number) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const copyToClipB = async (text: string) => {
  if (text !== "" || text) {
    await clipboard.writeText(text);
    toast(<p className="text-md">copied to clipboard</p>);
  } else {
    toast(<p className="text-md">Nothing to copy to clipboard</p>);
  }
};
