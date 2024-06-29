function reverseString(str) {
  return Array.from(str).reverse().join('');
};

function longestSetence(str) {
  return str.split(' ').reduce((current, next) => {
    // > get last found, >= get first found
    return current.length > next.length ? current : next;
  })
};

function countWords(query, input) {
  return query.map(e => {
    let count = 0;
    input.forEach(f => {
      if (e === f) count++
    });
    return count;
  });
};

function diagonalDifference(arr) {
  let primary = 0;
  let secondary = 0;

  for (let i = 0; i <= arr.length - 1; i++) {
    primary += arr[i][i];
    secondary += arr[i][arr.length - i - 1];
  }

  return Math.abs(primary - secondary);
};

console.log(reverseString('NEGIE1'))
console.log(longestSetence('Saya sangat senang mengerjakan soal algoritma.'))
console.log(countWords(['bbb', 'ac', 'dz'], ['xc', 'dz', 'bbb', 'dz']))
console.log(diagonalDifference([
  [1, 2, 0],
  [4, 5, 6],
  [7, 8, 9],
  [1, 0, 2],
]));