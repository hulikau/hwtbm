import { Question } from '../types';

// Database of math questions for the quiz
export const questions: Question[] = [
  // Arithmetic questions
  {
    id: 'a1',
    category: 'arithmetic',
    text: 'Кто считается "отцом арифметики"?',
    options: ['Пифагор', 'Диофант', 'Евклид', 'Архимед'],
    correctAnswerIndex: 1
  },
  {
    id: 'a2',
    category: 'arithmetic',
    text: 'Какое число является наименьшим простым числом?',
    options: ['0', '1', '2', '3'],
    correctAnswerIndex: 2
  },
  {
    id: 'a3',
    category: 'arithmetic',
    text: 'Что такое число Фибоначчи?',
    options: [
      'Число, которое является суммой двух предыдущих чисел в последовательности',
      'Число, которое делится только на 1 и на само себя',
      'Число, которое является степенью числа 2',
      'Число, которое равно сумме своих цифр'
    ],
    correctAnswerIndex: 0
  },
  {
    id: 'a4',
    category: 'arithmetic',
    text: 'Чему равен факториал числа 5 (5!)?',
    options: ['5', '15', '120', '720'],
    correctAnswerIndex: 2
  },
  {
    id: 'a5',
    category: 'arithmetic',
    text: 'Какое наименьшее общее кратное (НОК) чисел 6 и 8?',
    options: ['12', '24', '48', '6'],
    correctAnswerIndex: 1
  },
  
  // Algebra questions
  {
    id: 'b1',
    category: 'algebra',
    text: 'Кто из перечисленных математиков внес значительный вклад в развитие алгебры?',
    options: ['Аль-Хорезми', 'Евклид', 'Архимед', 'Фалес'],
    correctAnswerIndex: 0
  },
  {
    id: 'b2',
    category: 'algebra',
    text: 'Что такое матрица в алгебре?',
    options: [
      'Прямоугольная таблица чисел',
      'График функции',
      'Множество решений уравнения',
      'Особая точка на графике'
    ],
    correctAnswerIndex: 0
  },
  {
    id: 'b3',
    category: 'algebra',
    text: 'Какой из следующих многочленов является приведенным?',
    options: ['3x² + 2x + 1', 'x² + 2x + 1', '3x² + 2x', 'x³ - 3x²'],
    correctAnswerIndex: 1
  },
  {
    id: 'b4',
    category: 'algebra',
    text: 'Что такое определитель матрицы?',
    options: [
      'Число, характеризующее матрицу',
      'Сумма элементов главной диагонали',
      'Наибольший элемент матрицы',
      'Ранг матрицы'
    ],
    correctAnswerIndex: 0
  },
  {
    id: 'b5',
    category: 'algebra',
    text: 'Решите уравнение: 2x + 5 = 13',
    options: ['x = 4', 'x = 9', 'x = 3', 'x = 5'],
    correctAnswerIndex: 0
  },
  
  // Geometry questions
  {
    id: 'c1',
    category: 'geometry',
    text: 'Кто написал труд "Начала", один из самых влиятельных текстов в истории математики?',
    options: ['Архимед', 'Евклид', 'Пифагор', 'Фалес'],
    correctAnswerIndex: 1
  },
  {
    id: 'c2',
    category: 'geometry',
    text: 'Чему равна сумма внутренних углов треугольника?',
    options: ['90°', '180°', '270°', '360°'],
    correctAnswerIndex: 1
  },
  {
    id: 'c3',
    category: 'geometry',
    text: 'Какая фигура имеет все стороны равной длины и все углы равной величины?',
    options: ['Ромб', 'Квадрат', 'Прямоугольник', 'Параллелограмм'],
    correctAnswerIndex: 1
  },
  {
    id: 'c4',
    category: 'geometry',
    text: 'Чему равна площадь круга, если его радиус равен r?',
    options: ['πr', '2πr', 'πr²', '2πr²'],
    correctAnswerIndex: 2
  },
  {
    id: 'c5',
    category: 'geometry',
    text: 'Что такое теорема Пифагора?',
    options: [
      'Сумма углов в треугольнике равна 180°',
      'В прямоугольном треугольнике квадрат длины гипотенузы равен сумме квадратов длин катетов',
      'Площадь круга равна πr²',
      'Объем шара равен 4/3πr³'
    ],
    correctAnswerIndex: 1
  },
  
  // Trigonometry questions
  {
    id: 'd1',
    category: 'trigonometry',
    text: 'Чему равен синус 90 градусов?',
    options: ['0', '1', '-1', '1/2'],
    correctAnswerIndex: 1
  },
  {
    id: 'd2',
    category: 'trigonometry',
    text: 'Какое из следующих тригонометрических тождеств верно?',
    options: [
      'sin²θ + cos²θ = 0',
      'sin²θ + cos²θ = 2',
      'sin²θ + cos²θ = 1',
      'sin²θ - cos²θ = 1'
    ],
    correctAnswerIndex: 2
  },
  {
    id: 'd3',
    category: 'trigonometry',
    text: 'Чему равен тангенс угла в 45 градусов?',
    options: ['0', '1', '√2', '√3'],
    correctAnswerIndex: 1
  },
  {
    id: 'd4',
    category: 'trigonometry',
    text: 'В каком квадранте синус и косинус имеют разные знаки?',
    options: [
      'В первом квадранте',
      'Во втором квадранте',
      'В третьем квадранте',
      'В четвертом квадранте'
    ],
    correctAnswerIndex: 3
  },
  {
    id: 'd5',
    category: 'trigonometry',
    text: 'Какой формулой выражается закон синусов для треугольника?',
    options: [
      'a/sin(A) = b/sin(B) = c/sin(C)',
      'a² + b² = c²',
      'cos(C) = (a² + b² - c²) / 2ab',
      'S = (1/2)ab·sin(C)'
    ],
    correctAnswerIndex: 0
  }
];

// Helper function to get random questions
export const getRandomQuestions = (count: number = 20): Question[] => {
  // Ensure we have at least the requested number of questions
  if (questions.length < count) {
    return questions;
  }
  
  // Create a copy to avoid modifying the original array
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  
  // Return the first {count} questions
  return shuffled.slice(0, count);
};

// Get questions by category
export const getQuestionsByCategory = (category: string): Question[] => {
  return questions.filter(q => q.category === category);
}; 