export function removeSensitiveFields(
  obj: any,
  fields: string[] = ["password"]
): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => removeSensitiveFields(item, fields));
  } else if (obj && typeof obj === "object") {
    console.log({ obj });
    if (obj instanceof Date) {
      return obj;
    }
    const sanitized: any = {};
    for (const key in obj) {
      console.log({ key });
      if (!fields.includes(key)) {
        sanitized[key] = removeSensitiveFields(obj[key], fields);
        console.log({ sanitized });
      }
    }
    return sanitized;
  }
  return obj;
}
