param([string]$projectConfiguration)

try {
	# Starts in project root
	cd ..

	& "GenerateTypescript\bin\$projectConfiguration\net5.0\GenerateTypeScript.exe"


	cp TestWebsite\pre-commit .git\hooks
	"Copied pre-commit to .git\hooks"
} catch {
	$_
	exit 1
}
