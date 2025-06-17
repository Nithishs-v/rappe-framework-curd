export const API_URL = 'http://3.111.75.24:8000/api/resource/nithish?fields=["name","firstname"]';
export const API_KEY = '146e020f5d1bae0';
export const API_SECRET = 'b864c9a87f9dcc8';
export const API_HEADERS = {
  Authorization: `Basic ${btoa(API_KEY + ":" + API_SECRET)}`,
  "Content-Type": "application/json",
  Accept: "application/json"
};
