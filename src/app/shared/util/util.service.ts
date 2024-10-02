export const patterns = {
    U: {
      pattern: new RegExp('[a-zA-Z0-9._]'), //username
      optional: true,
    },
    K: {
      pattern: new RegExp('[a-zA-Z0-9À-úÇç ]'), //alfanumerico COM ESPACO
      optional: true,
    },
    L: {
      pattern: new RegExp('[a-zA-ZÀ-úÇç ]'), //só letra COM ESPACO
      optional: true,
    },
    P: {
      pattern: new RegExp('[a-zA-Z0-9Çç!@#$%&*()~\'"\\[\\]{}\\-_+=|:;,.<>?]+'), // caracteres especiais SEM ESPACO
      optional: true,
    },
    Q: {
      pattern: new RegExp('[a-zA-Z0-9Çç!@#$%&*()~\'"\\[\\]{}\\-_+=|:;,.<>? \\n]+'), // caracteres especiais COM ESPACO
      optional: true,
    },
    A: {
      pattern: new RegExp('[a-zA-Z0-9À-úÇç!@#$%&*()~\'"\\[\\]{}\\-_+=|:;,.<>? \\n]+'), // TODOS OS CARACTERES, passivel de limitações futuras
      optional: true,
    },
    R: {
      pattern: new RegExp('[a-zA-Z0-9À-úÇç!@#$%&*()~\'"\\[\\]{}\\-_+=|:;,.<>? \\n]+'), // caracteres especiais COM ESPACO
      optional: true,
    },
  };
  