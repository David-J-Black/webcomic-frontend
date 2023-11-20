
export function jsonify(object: any): string {
  return JSON.stringify(object, null, 2);
}
