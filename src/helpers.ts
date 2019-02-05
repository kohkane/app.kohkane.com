interface String {
  replaceAll(value: any, replacementValue: string): string;
}

String.prototype.replaceAll = function(value: any, replacementValue: string) {
  return this.replace(new RegExp(value, 'g'), replacementValue);
};
