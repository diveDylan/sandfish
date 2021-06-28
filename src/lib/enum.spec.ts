import { generatorEnums, addEnumTail, codeSplitTransfer } from './enum';

test('generatorEnums will create an enums array', () => {
  expect(
    generatorEnums({
      enums: {
        CheckPeriod: { YEAR: '年度考核', QUARTER: '季度考核' },
      },
    }).enumsArray
  ).toContainEqual({
    name: 'CheckPeriodEnum',
    enums: [
      { label: '年度考核', value: 'YEAR' },
      { label: '季度考核', value: 'QUARTER' },
    ],
  });
  expect(
    generatorEnums({
      enums: {
        CheckPeriod: { 1: '年度考核', 2: '季度考核' },
      },
    }).enumsArray
  ).toHaveLength(0);
  expect(
    generatorEnums({
      enums: {
        CheckPeriod: [
          { name: '年度考核', value: 'YEAR' },
          { name: '季度考核', value: 'QUARTER' },
        ],
      },
      formatter: (item) => ({
        label: item.name,
        value: item.value,
      }),
    }).enumsArray
  ).toContainEqual({
    name: 'CheckPeriodEnum',
    enums: [
      { label: '年度考核', value: 'YEAR' },
      { label: '季度考核', value: 'QUARTER' },
    ],
  });
});

test('addEnumTail will add Enum string tail', () => {
  expect(addEnumTail('CheckPeriodEnum')).toBe('CheckPeriodEnum');
  expect(addEnumTail('CheckPeriod')).toBe('CheckPeriodEnum');
});

test('code split format', () => {
  expect(codeSplitTransfer('my:center:like')).toBe('my_center_like');
});
