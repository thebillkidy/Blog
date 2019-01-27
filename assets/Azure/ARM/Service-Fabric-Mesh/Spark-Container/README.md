Initialize Spark in Jupyter:

```python
import os
import sys

# Set Spark, or fallback to /usr/local/spark
spark_home = os.environ.get('SPARK_HOME', "/usr/local/spark")
sys.path.insert(0, spark_home + "/python")

# Add py4j to the path
sys.path.insert(0, os.path.join(spark_home, 'python/lib/py4j-0.10.7-src.zip'))

# Init PySpark
with open(os.path.join(spark_home, "python/pyspark/shell.py")) as f:
    code = compile(f.read(), "shell.py", 'exec')
    exec(code)
```

Demo Spark:

create sonnets.txt

```python
text_file = sc.textFile("/home/sonnets.txt")
print(text_file)

counts = text_file.flatMap(lambda line: line.split(" ")) \
    .map(lambda word: (word, 1)) \
    .reduceByKey(lambda a, b: a + b)
    
counts.collect()
```