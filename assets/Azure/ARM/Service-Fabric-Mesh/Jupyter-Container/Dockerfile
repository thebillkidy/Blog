FROM ubuntu:18.04

SHELL ["/bin/bash", "-c"]

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    ca-certificates \
    cmake \
    git \
    sudo \
    software-properties-common \
    vim \
    emacs \
    wget

# Sometimes needed to avoid SSL CA issues.
RUN update-ca-certificates

ENV HOME /home
WORKDIR ${HOME}/

# Conda Package Manager
RUN wget https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh -O miniconda.sh && \
    chmod +x miniconda.sh && \
    ./miniconda.sh -b -p ${HOME}/miniconda && \
    rm miniconda.sh

# Setting these env var outside of the install script to ensure
# they persist in image
# (See https://stackoverflow.com/questions/33379393/docker-env-vs-run-export)
ENV CONDA_DIR ${HOME}/miniconda/bin/conda
ENV CONDA_PATH ${HOME}/miniconda
ENV PATH ${CONDA_DIR}:$PATH

# ===============================================
# JUPYTER CONFIGURATION
# ===============================================
# Install Jupyter Notebook and active Jupyter Spark extension (https://github.com/mozilla/jupyter-spark)
RUN conda config --add channels akode # For jupyter-spark

RUN conda install --quiet --yes \
    'notebook=5.7.2' \
    'jupyter-spark=0.3.0' \
    'lxml=4.2.5'

RUN conda clean -tipsy && \
    jupyter serverextension enable --py jupyter_spark && \
    jupyter nbextension install --py jupyter_spark && \
    jupyter nbextension enable --py jupyter_spark && \
    jupyter nbextension enable --py widgetsnbextension && \
    jupyter notebook --generate-config

# Expose our ports
# 8888 = Jupyter Notebook
EXPOSE 8888

# Define default command.
CMD ["jupyter", "notebook", "--ip=0.0.0.0", "--allow-root", "--Spark.url=\"https://104.40.216.232:4040\""]