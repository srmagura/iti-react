param([string]$projectConfiguration)

try {
	# Starts in project root
	cd ..

	& "GenerateTypescript\bin\$projectConfiguration\GenerateTypeScript.exe"

	cp Website\pre-commit ..\.git\hooks
	"Copied pre-commit to .git\hooks"
} catch {
	$_
	exit 1
}
