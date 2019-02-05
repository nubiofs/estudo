import pandas as pd

# devices.rename(columns={"Retail Branding": "manufacturer"}, inplace=True)
# devices.shape

''' (default inner-join):

# Inner Merge / Inner join – The default Pandas behaviour, only keep rows 
# where the merge “on” value exists in both the left and right dataframes.
'''
'''
pd.merge(left, right, how='inner', on=None, left_on=None, right_on=None,
         left_index=False, right_index=False, sort=True,
         suffixes=('_x', '_y'), copy=True, indicator=False,
         validate=None)
         
# sort: Sort the result DataFrame by the join keys in lexicographical order. 
# Defaults to True, setting to False will improve performance substantially in many cases.

# validate : string, default None. If specified, checks if merge is of specified type.

        “one_to_one” or “1:1”: checks if merge keys are unique in both left and right datasets.
        “one_to_many” or “1:m”: checks if merge keys are unique in left dataset.
        “many_to_one” or “m:1”: checks if merge keys are unique in right dataset.
        “many_to_many” or “m:m”: allowed, but does not result in checks.
         
        Checking key uniqueness is also a good way to ensure user data structures are as expected.
         
'''         
'''

# “Inner join produces only the set of records that match in both Table A and Table B.”


# Exemplos:

result = pd.merge(user_usage,
                 user_device[['use_id', 'platform', 'device']],
                 on='use_id')
                 
# ou

result = pd.merge(user_usage,
                 user_device[['use_id', 'platform', 'device']],
                 on='use_id',
                 how='inner')
'''             

'''
result = pd.merge(result, 
                  devices[['manufacturer', 'Model']],
                  left_on='device',
                  right_on='Model',
                  how='left',
                  indicator=True)
                  
'''
# devices[devices.Model == 'SM-G930F']
# devices[devices.Device.str.startswith('GT')]

# pd.merge(left, right, how='outer').dtypes

'''
result.groupby("manufacturer").agg({
        "outgoing_mins_per_month": "mean",
        "outgoing_sms_per_month": "mean",
        "monthly_mb": "mean",
        "use_id": "count"
    })
'''

# UNION ALL can be performed using concat():
# pd.concat([df1, df2])
# pd.concat([df1, df2]).drop_duplicates()

# UPDATE:
# tips.loc[tips['tip'] < 2, 'tip'] *= 2

# DELETE:
# tips = tips.loc[tips['tip'] <= 9]

# print("user_device dimensions: {}".format(user_device[['use_id', 'platform', 'device']].shape))

# user_usage['use_id'].isin(user_device['use_id']).value_counts()

# print("There are {} missing values in the result.".format(result['device'].isnull().sum()))

# result.iloc[[0, 1, 10, 200,201, 350,351]]

# Join the two dataframes along rows:
# df_new = pd.concat([df_a, df_b])
# Join the two dataframes along columns:
# pd.concat([df_a, df_b], axis=1)

# Merge while adding a suffix to duplicate column names:
# pd.merge(df_a, df_b, on='subject_id', how='left', suffixes=('_left', '_right'))

# tips[tips['time'] == 'Dinner'].head(5)
# is_dinner = tips['time'] == 'Dinner'
# is_dinner.value_counts()
# tips[(tips['time'] == 'Dinner') & (tips['tip'] > 5.00)]
# tips[(tips['size'] >= 5) | (tips['total_bill'] > 45)]
# frame[frame['col2'].isna()]
# frame[frame['col1'].notna()]
# tips.groupby('sex').size()
# tips.groupby('sex').count()
# tips.groupby('day').agg({'tip': np.mean, 'day': np.size})

################################
# [w.upper() for w in text1]
