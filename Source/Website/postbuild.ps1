param([string]$projectConfiguration)

try {
	# Starts in project root
	cd ..
	
	& "GenerateTypescript\bin\$projectConfiguration\GenerateTypeScript.exe"

	cp Website\pre-commit ..\.git\hooks
	"Copied pre-commit to .git\hooks"

	If($projectConfiguration -eq "RELEASE"){
		"Beginning production webpack build"
		Website\node_modules\.bin\webpack --env.prod
	}

} catch {
	$_
	exit 1
}