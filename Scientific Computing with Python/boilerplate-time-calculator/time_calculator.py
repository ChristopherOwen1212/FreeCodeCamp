def add_time(start, duration, start_day=""):
  time, suffix = start.split()
  hours, minutes = time.split(':')
  hours = int(hours)
  minutes = int(minutes)

  added_hour, added_minutes = duration.split(':')
  added_hour = int(added_hour)
  added_minutes = int(added_minutes)

  #Change to 24 hours format
  hours %= 12
  if(suffix == "PM"):
    hours += 12

  # Calculating total hours, minutes
  minutes += added_minutes
  extra_hour, minutes = divmod(minutes, 60)

  hours = hours + added_hour + extra_hour
  days_later, hours = divmod(hours, 24)

  new_suffix = "AM" if hours < 12 else "PM"

  #Change back to 12 hours format
  hours %= 12
  if hours == 0:
    hours = 12

  day_dict = {
    "Sunday": 0,
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6,
  }

  new_time = ""

  if start_day == "":
    if days_later == 0:  
      new_time = "{}:{:02d} {}".format(hours, minutes, new_suffix)
    elif days_later == 1:
      new_time = "{}:{:02d} {} (next day)".format(hours, minutes, new_suffix)
    elif days_later > 1:
      new_time = "{}:{:02d} {} ({} days later)".format(hours, minutes, new_suffix, days_later)
  else:
    new_day_value = (day_dict[start_day.lower().capitalize()] + days_later) % 7
    new_day = list(day_dict.keys())[list(day_dict.values()).index(new_day_value)]
    
    if days_later == 0:  
      new_time = "{}:{:02d} {}, {}".format(hours, minutes, new_suffix, new_day)
    elif days_later == 1:
      new_time = "{}:{:02d} {}, {} (next day)".format(hours, minutes, new_suffix, new_day)
    elif days_later > 1:
      new_time = "{}:{:02d} {}, {} ({} days later)".format(hours, minutes, new_suffix, new_day ,days_later)
    
  return new_time.strip()