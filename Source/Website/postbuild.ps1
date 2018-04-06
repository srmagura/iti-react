param([string]$projectConfiguration)

try {
	# Starts in project root
	cd ..
	
	GenerateTypescript\bin\Debug\GenerateTypeScript.exe

	cd Website

	# Building during the post build step does not work well during development,
	# since webpack --watch is also running.
	#
	# After building in STAGING or RELEASE, you need to restart webpack --watch.
	If($projectConfiguration -eq "RELEASE"){
		$env:NODE_ENV= "production"
		node_modules\.bin\webpack
	}

} catch {
	$_
	exit 1
}