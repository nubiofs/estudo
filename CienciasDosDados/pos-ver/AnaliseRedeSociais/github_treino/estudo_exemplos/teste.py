# https://github.com/ericmjl/Network-Analysis-Made-Simple/blob/master/0-pre-tutorial-exercises.ipynb

# 1. Basic Python data structures
# I have a list of dictionaries as such:
names = [{'name': 'Eric',
          'surname': 'Ma'},
         {'name': 'Jeffrey',
          'surname': 'Elmer'},
         {'name': 'Mike',
          'surname': 'Lee'},
         {'name': 'Jennifer',
          'surname': 'Elmer'}]

# Write a function that takes in a list of dictionaries and a query surname, 
# and searches it for all individuals with a given surname.
def find_persons_with_surname(persons, query_surname):
    # Assert that the persons parameter is a list. 
    # This is a good defensive programming practice.
    assert isinstance(persons, list)   
    
    results = []
    for s in persons:
        if s['surname'] == query_surname:
            results.append(s)
    
    return results

# Test your result below.
results = find_persons_with_surname(names, 'Lee')
assert len(results) == 1

results = find_persons_with_surname(names, 'Elmer')
assert len(results) == 2

#https://github.com/ericmjl/Network-Analysis-Made-Simple/blob/master/1-introduction.ipynb
my_fav_things = []
my_fav_things.append({'name': 'raindrops on roses', 'line': 1})
my_fav_things.append({'name': 'whiskers on kittens', 'line': 1})
my_fav_things.append({'name': 'bright copper kettles', 'line': 2})

[s for s in my_fav_things if s['name'] == 'raindrops on roses']