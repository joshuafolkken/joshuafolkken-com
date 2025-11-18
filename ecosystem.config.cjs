const package_info = require('./package.json')
const name = package_info.name

console.log('name:', name)

module.exports = {
	apps: [
		{
			name: name,
			script: 'build/index.js',
			instances: '1',
			exec_mode: 'cluster',
			env: {
				PORT: 3001,
				DATABASE_URL: database_url,
			},
			error_file: './logs/err.log',
			out_file: './logs/out.log',
			log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
			merge_logs: true,
			autorestart: true,
			watch: false,
			max_memory_restart: '1G',
		},
	],
}
