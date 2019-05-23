As you might've heard, Microsoft is working on a new "Windows Terminal" supporting GPU acceleration as well as including emoji support, theming, ... for more details check the following link: [https://devblogs.microsoft.com/commandline/introducing-windows-terminal/](https://devblogs.microsoft.com/commandline/introducing-windows-terminal/).

But what's a new terminal without actually testing it!? So let's get our hands dirty and start playing with it!

## Installing PreRequisites

### Visual Studio 2019 Community

> Note: this is around 4Gb on disk

Before we can get started, we of course need Visual Studio to be installed first. The online source depends on 2017 but we can get it working on 2019 as well.

1. Go to https://visualstudio.microsoft.com/vs/
2. Download it and run 
3. Make sure to select the arrows as shown below and click on install

![/assets/images/posts/windows-terminal/visual_studio_install.png](/assets/images/posts/windows-terminal/visual_studio_install.png)

### Adapting the Windows Terminal Source Code for Visual Studio 2019 support (old)

> Note: This is not needed on the moment anymore after a merge happened recently adding this to master.

To get Windows Terminal working in Visual Studio 2019, we have to change a small thing:

1. Open `src/inc/LibraryIncludes.h` 
2. Add line `#include <functional>` after `#include <filesystem>`

> For more information, see [PR #449](https://github.com/microsoft/Terminal/pull/449/commits/ebb1c620dd3d9604b5164a89dd68a6c77922f7d7)

<!-- ### MSBuild

1. Go to [https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=BuildTools&rel=16](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=BuildTools&rel=16) and scroll down towards "Tools for Visual Studio 2019", then select "Build Tools for Visual Studio 2019" and download + install it
2. When installing, select:
	* C++ Build Tools
	* .NET desktop build tools
	* Universal Windows Platform build tools

> Note: "msbuild.exe" is being installed by default at "C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\MSBuild\Current\Bin" -->

## Installing Windows Terminal

The GitHub page of Windows Terminal can be found at: https://github.com/Microsoft/Terminal

We thus clone it and follow the documentation:

```sh
# Download the project
git clone https://github.com/microsoft/Terminal.git
cd Terminal/
git submodule update --init --recursive

# Install dependencies with included nuget
./dep/nuget/nuget.exe restore OpenConsole.sln

# Run build with our msbuild tool from Visual Studio
& 'C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\MSBuild\Current\Bin\MSBuild.exe' OpenConsole.sln
```

Once our build finishes (which took around 13 minutes for me) you will be able to see that the `build/` folder has been populated and now contains `OpenConsole.exe`. When we open this application, we will see our own `CMD` as we are used to.

![/assets/images/posts/windows-terminal/cmd.png](/assets/images/posts/windows-terminal/cmd.png)

## Confirming Build





& 'C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\MSBuild\Current\Bin\MSBuild.exe' OpenConsole.sln -p:PlatformToolset=v142 -t:Build -p:OutDir=c:\Users\xageerin\Documents\Terminal\build\ -p:Configuration=Release -p:Platform=x64