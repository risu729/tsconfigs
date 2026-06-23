// Ref: https://semantic-release.gitbook.io/semantic-release/usage/configuration

/**
 * @type {import("semantic-release").Options}
 */
const config = {
	plugins: [
		"@semantic-release/commit-analyzer",
		"@semantic-release/release-notes-generator",
		"@semantic-release/npm",
		[
			"@semantic-release/github",
			{
				failCommentCondition: false,
				successComment: false,
			},
		],
	],
};

export default config;
