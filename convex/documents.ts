import { paginationOptsValidator } from "convex/server"
import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"

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

		const isOwner = document.ownerId === identity.subject
		const isOrganizationMember =
			organizationRole !== undefined && organizationRole !== null
		// const isOrganizationMember = !!(document.organizationId && document.organizationId === identity.organizationId)
		const isAdmin = organizationRole === "org:admin"

		if (
			// document.ownerId !== identity.subject &&
			// organizationRole !== "org:admin"
			!isOwner &&
			// !isOrganizationMember &&
			!isAdmin
		) {
			if (organizationRole !== "org:admin")
				throw new ConvexError("Not Administrator")
			// if (!isOwner) throw new ConvexError("Not owner of the document")
			if (!isOrganizationMember)
				throw new ConvexError("Not a member of the organization")
			throw new ConvexError("Not authorized")
		}

		await ctx.db.patch(args.id, { title: args.title })
	},
})

export const getById = query({
	args: { id: v.id("documents") },
	handler: async (ctx, { id }) => {
		return await ctx.db.get(id)
	},
})
