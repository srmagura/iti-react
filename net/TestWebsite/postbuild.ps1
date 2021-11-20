param([string]$projectConfiguration)

try {
	# Starts in project root
	cd ..

	& "GenerateTypescript/bin/$projectConfiguration/net6.0/GenerateTypeScript.exe"


	cp TestWebsite/pre-commit ../.git/hooks
	"Copied pre-commit to .git/hooks"
} catch {
	$_
	exit 1
}
