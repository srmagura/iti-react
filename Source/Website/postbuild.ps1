param([string]$projectConfiguration)

try {
	# Starts in project root
	cd ..
	
	GenerateTypescript\bin\Debug\GenerateTypeScript.exe

	#cd Website

	# After building in RELEASE, you need to restart webpack --watch.
	#If($projectConfiguration -eq "RELEASE"){
	#	$env:NODE_ENV= "production"
	#	node_modules\.bin\webpack
	#}

} catch {
	$_
	exit 1
}