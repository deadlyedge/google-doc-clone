import { v } from "convex/values"
import { query } from "./_generated/server"
export const get = query({
	handler: async (ctx) => {
		const documents = await ctx.db.query("documents").collect()
		return documents
	},
})
