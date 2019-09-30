#!/bin/bash
for i in `seq 1 1000 8000000`; do
sleep 1
wget -k "https://explorer.testnet2.matic.network/txs?block_number=$i&index=0&type=JSON" -O your_local_output_dir_$i &
done
mkdir data
mv your_local_output_dir_* data/

for file in data/*; do printf "$(<"$file")\nXXXXXXXXXXXX\n"; done > outfor.txt
grep -Eoh 'address/[^"]+|tx/[^"]+'  outfor.txt  > awkout.txt
cat awkout.txt | grep address | sed 's/address\///g' > addresses.txt

python filter.py > filterout.txt
sed -e ':a; N; $!ba; s/\naddress\//,/g' filterout.txt | sed 's/tx\///g' > transactions-full-data.csv
