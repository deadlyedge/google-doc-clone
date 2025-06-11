import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { paginationOptsValidator } from "convex/server"

export const create = mutation({
	args: {
		title: v.optional(v.string()),
		initialContent: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity()

		if (!identity) throw new ConvexError("Not authenticated")

		const organizationId = (identity.organization_id ?? undefined) as
			| string
			| undefined

		return await ctx.db.insert("documents", {
			title: args.title ?? "Untitled Document",
			ownerId: identity.subject,
			organizationId,
			initialContent: args.initialContent ?? "",
		})
	},
})

export const get = query({
	args: {
		paginationOpts: paginationOptsValidator,
		filter: v.optional(v.string()),
	},
	handler: async (ctx, { filter, paginationOpts }) => {
		const identity = await ctx.auth.getUserIdentity()

		if (!identity) throw new ConvexError("Not authenticated")

		const organizationId = (identity.organization_id ?? undefined) as
			| string
			| undefined

		if (organizationId && filter) {
			return await ctx.db
				.query("documents")
				.withSearchIndex("search_title", (q) =>
					q.search("title", filter).eq("organizationId", organizationId),
				)
				.paginate(paginationOpts)
		}

		if (filter) {
			return await ctx.db
				.query("documents")
				.withSearchIndex("search_title", (q) =>
					q.search("title", filter).eq("ownerId", identity.subject),
				)
				.paginate(paginationOpts)
		}

		if (organizationId) {
			return await ctx.db
				.query("documents")
				.withIndex("by_organizationId", (q) =>
					q.eq("organizationId", organizationId),
				)
				.paginate(paginationOpts)
		}

		return await ctx.db
			.query("documents")
			.withIndex("by_ownerId", (q) => q.eq("ownerId", identity.subject))
			.paginate(paginationOpts)
	},
})

export const removeById = mutation({
	args: { id: v.id("documents") },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity()

		if (!identity) throw new ConvexError("Not authenticated")

		const organizationRole = (identity.organization_role ?? undefined) as
			| string
			| undefined

		const document = await ctx.db.get(args.id)

		if (!document) throw new ConvexError("Document not found")

		if (
			document.ownerId !== identity.subject &&
			organizationRole !== "org:admin"
		) {
			if (organizationRole !== "org:admin")
				throw new ConvexError("Not Administrator")
			throw new ConvexError("Not authorized")
		}

		await ctx.db.delete(args.id)
	},
})

export const updateById = mutation({
	args: { id: v.id("documents"), title: v.string() },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity()

		if (!identity) throw new ConvexError("Not authenticated")

		const organizationRole = (identity.organization_role ?? undefined) as
			| string
			| undefined

		const document = await ctx.db.get(args.id)

		if (!document) throw new ConvexError("Document not found")

		if (
			document.ownerId !== identity.subject &&
			organizationRole !== "org:admin"
		) {
			if (organizationRole !== "org:admin")
				throw new ConvexError("Not Administrator")
			throw new ConvexError("Not authorized")
		}

		await ctx.db.patch(args.id, { title: args.title })
	},
})
