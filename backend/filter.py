from pprint import pprint
import re
# import datetime
from datetime import datetime

epoch = datetime.utcfromtimestamp(0)
def unix_time_millis(dt):
    return (dt - epoch).total_seconds() #* 1000.0


f = open('tokendata.txt')
line = f.readline()
buffer = []

while line:
    if "tx/" in line :
        if len(buffer) > 2:
            matchObj1 = re.match( r'[0-9.]+', buffer[-2][:-1], re.M|re.I) # amount
            matchObj2 = re.search( r'[A-Z]+', buffer[-2][:-1], re.M) # token
            matchObj3 = re.search( r'"[0-9:.\- Z]+', buffer[-1][:-1], re.M) # date
            if not matchObj1 or not matchObj2 or not matchObj3:
                buffer = []
                continue
            # print(buffer[0])[:-1] # txhash
            # print(buffer[-4])[:-1] # from
            # print(buffer[-3])[:-1] # to
            # # print(buffer[-1])[:-1] # to

            # print( matchObj1.group())
            # print( matchObj2.group())
            # print( matchObj3.group())

            dat = matchObj3.group()[1:-8]
            # #2019-04-13 11:59:34.000000
            datetime_object = datetime.strptime(dat,
             '%Y-%m-%d %H:%M:%S')
            mil = unix_time_millis(datetime_object)

            out = buffer[0][3:-1] + "," + buffer[-4][8:-1] + "," + buffer[-3][8:-1] + "," + \
            matchObj1.group()+ "," + matchObj2.group()+ "," + str(mil)[:-2] + "000"
            print(out)

        buffer = []

    buffer.append(line)

    # use realine() to read next line
    line = f.readline()
f.close()
print(buffer[0])[:-1]
print(buffer[-2])[:-1]
print(buffer[-1])[:-1]
