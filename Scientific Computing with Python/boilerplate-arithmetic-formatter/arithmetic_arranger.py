def arithmetic_arranger(problems, showAnswer = False):
  arranged_problems = ''
  #Check if there are too many problems 
  if len(problems) > 5:
    return "Error: Too many problems."

  #Check Operator must be '+' or '-'
  operations = list(map(lambda x: x.split()[1], problems))
  if set(operations) != {'+', '-'} and len(set(operations)) != 2:
    return "Error: Operator must be '+' or '-'."

  numbers = []
  for i in problems:
    p = i.split()
    numbers.extend([p[0], p[2]])

  #Check all operands is number
  if not all(map(lambda x: x.isdigit(), numbers)):
    return "Error: Numbers must only contain digits."

  #Check all operands has a max of four digits
  if not all(map(lambda x: len(x) < 5, numbers)):
    return "Error: Numbers cannot be more than four digits."

  top_row = ''
  dashes = ''
  values = list(map(lambda x: eval(x), problems))
  answers = ''
  for i in range(0, len(numbers), 2):
    space_width = max(len(numbers[i]), len(numbers[i+1])) + 2
    top_row += numbers[i].rjust(space_width)
    dashes += '-' * space_width
    answers += str(values[i // 2]).rjust(space_width)
    if i != len(numbers) - 2:
      top_row += ' ' * 4
      dashes += ' ' * 4
      answers += ' ' * 4

  bottom_row = ''
  for i in range(1, len(numbers), 2):
    space_width = max(len(numbers[i - 1]), len(numbers[i])) + 1
    bottom_row += operations[i // 2]
    bottom_row += numbers[i].rjust(space_width)
    if i != len(numbers) - 1:
      bottom_row += ' ' * 4

  if showAnswer:
    arranged_problems = '\n'.join((top_row, bottom_row, dashes, answers))
  else:
    arranged_problems = '\n'.join((top_row, bottom_row, dashes))
    
  return arranged_problems