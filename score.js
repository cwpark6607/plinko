const outputs = [];
const k = 3;

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  // Ran every time a balls drops into a bucket
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const testSetSize = 50;
  const [testSet, trainingSet] = splitDataset(outputs, testSetSize);

  let numberCorrect = 0;
  /*
  for (let i = 0; i < testSet.length; i++) {
    const bucket = knn(trainingSet, testSet[i][0]);
    
    if (bucket === testSet[i][3]) {
      numberCorrect++;
    }
  }
  console.log('Accuracy:', numberCorrect / testSetSize);
  */

  _.range(1, 20).forEach(k => {
    const accuracy = _.chain(testSet)
      .filter(testPoint => knn(trainingSet, testPoint[0], k) === testPoint[3])
      .size()
      .divide(testSetSize)
      .value();

    console.log('For k of', k, 'accuracy is', accuracy);
  });
}

function knn(data, point, k) {
// data: 트레이닝 데이터셋
// point: 예측할 드롭 지점
  return bucket = _.chain(data)
    .map(row => [distance(row[0], point), row[3]])
    .sortBy(row => row[0])
    .slice(0, k)
    .countBy(row => row[1])
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .first()
    .parseInt()
    .value();
}

function distance(pointA, pointB) {
  return Math.abs(pointA - pointB);
}

function splitDataset(data, testCount) {
// 전체 데이터셋을 테스트용과 트레이닝용 셋으로 분리
  const shuffled = _.shuffle(data);

  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
}