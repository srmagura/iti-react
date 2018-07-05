Param([string]$deployTo)

#$slnPath = "../CapitalCity.sln"

$staging = "staging"
$prod = "prod"

if($deployTo -eq $staging) {
	#$username = '$CapitalCityStaging'
	#$password = 'kcPJ0uErsNLXgL23QZxBfCdRwricrc15LmzSsswT9k0ug7zbNX2cqakzHqSy'
	#$publishProfile = 'CapitalCityStaging - Web Deploy'
} elseif ($deployTo -eq $prod) {
	#$username = '$CapitalCityCG'
	#$password = Read-Host -Prompt 'Web Deploy password'
	#$publishProfile = 'CapitalCityCG - Web Deploy'
} else {
	"Usage: ./deploy.ps1 [-DeployTo] <string>"
	"DeployTo must equal `"$staging`" or `"$prod`"."
	exit 1
}

# MSBuild path needs to be updated when a new major version of Visual Studio is released
$msbuild = "& 'C:\Program Files (x86)\Microsoft Visual Studio\2017\Enterprise\MSBuild\15.0\Bin\MSBuild.exe'"
$logfile = "bin\DeployLog.txt"
$logenc = "utf8"
$verbosity = 'minimal'

$pipeToOutFile = "| Out-File -Encoding $logenc -Append '$logfile'"

$msbuildDeployArgs = "/p:DeployOnBuild=true /p:PublishProfile='$publishProfile' " + 
	"/p:Configuration=Release " + 
	"/p:UserName='$username' /p:Password='$password' /verbosity:$verbosity " + 
	$pipeToOutFile

	
function Start-Deploy ([string]$name) {
	"Deploying $name..."
}

function End-Step ([string]$name) {
	"DONE"
	""
}

function Check-Error {
	if($LastExitCode -ne 0) {
		throw "FAILURE - Check the log to see the error."
	}
}

function Build-Solution {
	"Building solution..."
	
	$cmd = "$msbuild $slnPath /p:Configuration=Release /verbosity:$verbosity $pipeToOutFile"
	iex $cmd

	End-Step

	"Running production webpack build... (this will take ~1 minute)"
	
	$cmd = "node_modules\.bin\webpack --env.prod $pipeToOutFile"
	iex $cmd
	Check-Error

	End-Step
}

function Deploy-Website {
	Start-Deploy "Website"

	$cmd = "$msbuild Website.csproj $msbuildDeployArgs"
	iex $cmd

	Check-Error
	End-Step
}

function Deploy-WebJob ([string]$name) {
	Start-Deploy $name

	$csprojPath = "..\$name\$name.csproj"
	$cmd = "$msbuild $csprojPath $msbuildDeployArgs"
	iex $cmd

	Check-Error
	End-Step
}

try {
	# Navigate to the Website project directory
	Push-Location $PSScriptRoot

	if(Test-Path $logfile) {
		Remove-Item $logfile
	}

	"Writing log to Website\$logfile"
	""

	Build-Solution
	
	Deploy-Website
	# Deploy-WebJob NotificationWebJob
} catch {
	$_.Exception
} finally {
	Pop-Location
}
