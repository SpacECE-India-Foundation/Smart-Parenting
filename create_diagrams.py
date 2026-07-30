import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

os.makedirs('diagrams', exist_ok=True)

# Global style settings
plt.rcParams['font.sans-serif'] = 'Helvetica'
plt.rcParams['axes.edgecolor'] = '#CBD5E1'
plt.rcParams['axes.linewidth'] = 1.2

# ─────────────────────────────────────────────────────────────────────────────
# DIAGRAM 1: Visual Directory Skeleton & File Hierarchy Tree
# ─────────────────────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(12, 8), dpi=300)
ax.set_xlim(0, 12)
ax.set_ylim(0, 8)
ax.axis('off')

# Background
ax.add_patch(patches.Rectangle((0, 0), 12, 8, facecolor='#F8FAFC', edgecolor='none'))

# Root Node
ax.add_patch(patches.FancyBboxPatch((4.5, 7.1), 3.0, 0.7, boxstyle="round,pad=0.1,rounding_size=0.15", facecolor="#1E293B", edgecolor="#0F172A", lw=2))
ax.text(6.0, 7.45, "SpacECE MongoDB (Root)", ha='center', va='center', color='white', fontweight='bold', fontsize=11)

# Backend Branch (Left)
ax.add_patch(patches.FancyBboxPatch((0.5, 5.8), 5.0, 0.7, boxstyle="round,pad=0.1,rounding_size=0.15", facecolor="#DBEAFE", edgecolor="#2563EB", lw=2))
ax.text(3.0, 6.15, "backend/ (Express.js REST API)", ha='center', va='center', color='#1E40AF', fontweight='bold', fontsize=10)

# Frontend Branch (Right)
ax.add_patch(patches.FancyBboxPatch((6.5, 5.8), 5.0, 0.7, boxstyle="round,pad=0.1,rounding_size=0.15", facecolor="#FEF3C7", edgecolor="#D97706", lw=2))
ax.text(9.0, 6.15, "frontend/ (React.js + Vite SPA)", ha='center', va='center', color='#92400E', fontweight='bold', fontsize=10)

# Connect Root to Branches
ax.annotate("", xy=(3.0, 6.5), xytext=(5.5, 7.1), arrowprops=dict(arrowstyle="->", color="#64748B", lw=2))
ax.annotate("", xy=(9.0, 6.5), xytext=(6.5, 7.1), arrowprops=dict(arrowstyle="->", color="#64748B", lw=2))

# Backend Submodules (Left Boxes)
backend_boxes = [
    (0.5, 4.4, 2.3, 1.0, "server.js\n(App entry & DB connect)", "#EFF6FF", "#3B82F6"),
    (3.2, 4.4, 2.3, 1.0, "middleware/auth.js\n(JWT Guard)", "#F3E8FF", "#9333EA"),
    (0.5, 3.1, 2.3, 1.0, "models/\n(User, Child, Score, etc.)", "#DCFCE7", "#16A34A"),
    (3.2, 3.1, 2.3, 1.0, "routes/\n(auth, children, scores...)", "#FEE2E2", "#DC2626"),
    (0.5, 1.8, 5.0, 0.9, "seed_mongodb.js (Database initialization & default game data)", "#F1F5F9", "#475569"),
]

for x, y, w, h, text, bg_c, b_c in backend_boxes:
    ax.add_patch(patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.08,rounding_size=0.1", facecolor=bg_c, edgecolor=b_c, lw=1.5))
    ax.text(x + w/2, y + h/2, text, ha='center', va='center', fontsize=8, fontweight='bold', color='#1E293B')
    ax.annotate("", xy=(x + w/2, y + h), xytext=(3.0, 5.8), arrowprops=dict(arrowstyle="->", color="#94A3B8", lw=1))

# Frontend Submodules (Right Boxes)
frontend_boxes = [
    (6.5, 4.5, 2.3, 0.9, "src/App.jsx & main.jsx\n(Routing & Mount)", "#FEF9C3", "#CA8A04"),
    (9.2, 4.5, 2.3, 0.9, "src/context/\n(Auth, User, Child Profile)", "#E0F2FE", "#0284C7"),
    (6.5, 3.3, 2.3, 0.9, "src/pages/\n(child, parent, teacher...)", "#FCE7F3", "#DB2777"),
    (9.2, 3.3, 2.3, 0.9, "src/components/\n(layout, child, shared...)", "#ECFDF5", "#059669"),
    (6.5, 2.1, 2.3, 0.9, "src/api/\n(client, auth, services)", "#F3E8FF", "#7C3AED"),
    (9.2, 2.1, 2.3, 0.9, "src/services/\n(analyticsService.ts)", "#CCFBF1", "#0D9488"),
]

for x, y, w, h, text, bg_c, b_c in frontend_boxes:
    ax.add_patch(patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.08,rounding_size=0.1", facecolor=bg_c, edgecolor=b_c, lw=1.5))
    ax.text(x + w/2, y + h/2, text, ha='center', va='center', fontsize=8, fontweight='bold', color='#1E293B')
    ax.annotate("", xy=(x + w/2, y + h), xytext=(9.0, 5.8), arrowprops=dict(arrowstyle="->", color="#94A3B8", lw=1))

# Root Configuration Bar
ax.add_patch(patches.FancyBboxPatch((0.5, 0.4), 11.0, 0.9, boxstyle="round,pad=0.08,rounding_size=0.1", facecolor="#F8FAFC", edgecolor="#94A3B8", lw=1.5))
ax.text(6.0, 0.85, "Root Assets & Configs: package.json • run.sh • spacece_games_list.csv • README.md • PROJECT_STRUCTURE.md", ha='center', va='center', fontsize=8.5, fontweight='bold', color='#334155')

ax.set_title("SpacECE MongoDB — Complete Visual File Skeleton & Module Tree", fontsize=12, fontweight='bold', pad=12, color='#0F172A')
plt.tight_layout()
plt.savefig('diagrams/visual_file_tree.png', dpi=300, bbox_inches='tight')
plt.close()


# ─────────────────────────────────────────────────────────────────────────────
# DIAGRAM 2: Database Schema ERD (MongoDB Schemas Relationship)
# ─────────────────────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(12, 7), dpi=300)
ax.set_xlim(0, 12)
ax.set_ylim(0, 7)
ax.axis('off')

ax.add_patch(patches.Rectangle((0, 0), 12, 7, facecolor='#F8FAFC', edgecolor='none'))

# Collections
collections = [
    (0.8, 4.5, 3.0, 2.0, "User Collection\n(backend/models/User.js)\n─────────────────────\n• _id (ObjectId)\n• email (String)\n• password (Hash)\n• displayName (String)\n• role (parent/teacher/admin)\n• emailVerified (Boolean)", "#EFF6FF", "#2563EB"),
    (4.5, 4.5, 3.0, 2.0, "ChildProfile Collection\n(backend/models/ChildProfile.js)\n─────────────────────\n• _id (ObjectId)\n• parent_uid (Ref -> User)\n• name & age (Number)\n• xp, stars, coins (Number)\n• level & progress (Object)", "#DCFCE7", "#16A34A"),
    (8.2, 4.5, 3.0, 2.0, "Score Collection\n(backend/models/Score.js)\n─────────────────────\n• _id (ObjectId)\n• child_id (Ref -> Child)\n• game_id & activity_type\n• score & accuracy (%)\n• time_spent (Seconds)", "#FEF3C7", "#D97706"),
    (2.6, 1.2, 3.2, 2.0, "Recommendation Collection\n(backend/models/Recommendation.js)\n─────────────────────\n• _id (ObjectId)\n• child_id (Ref -> Child)\n• domain (Literacy/Math...)\n• priority (High/Med/Low)\n• completed (Boolean)", "#F3E8FF", "#9333EA"),
    (6.4, 1.2, 3.2, 2.0, "Notification Collection\n(backend/models/Notification.js)\n─────────────────────\n• _id (ObjectId)\n• recipient_uid (Ref -> User)\n• title & body (String)\n• read (Boolean)\n• created_at (Date)", "#FCE7F3", "#DB2777"),
]

for x, y, w, h, text, bg_c, b_c in collections:
    ax.add_patch(patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.1,rounding_size=0.15", facecolor=bg_c, edgecolor=b_c, lw=1.8))
    ax.text(x + w/2, y + h/2, text, ha='center', va='center', fontsize=7.8, fontweight='semibold', color='#1E293B')

# Relationship Arrows
ax.annotate("1 : N (Parent -> Child)", xy=(4.5, 5.5), xytext=(3.8, 5.5), arrowprops=dict(arrowstyle="->", color="#2563EB", lw=2, mutation_scale=15), fontsize=7, fontweight='bold', color='#1E40AF')
ax.annotate("1 : N (Child -> Scores)", xy=(8.2, 5.5), xytext=(7.5, 5.5), arrowprops=dict(arrowstyle="->", color="#16A34A", lw=2, mutation_scale=15), fontsize=7, fontweight='bold', color='#15803D')
ax.annotate("1 : N (Child -> Recs)", xy=(4.2, 3.2), xytext=(5.5, 4.5), arrowprops=dict(arrowstyle="->", color="#9333EA", lw=2, mutation_scale=15), fontsize=7, fontweight='bold', color='#7E22CE')
ax.annotate("1 : N (User -> Alerts)", xy=(7.5, 3.2), xytext=(2.3, 4.5), arrowprops=dict(arrowstyle="->", color="#DB2777", lw=1.5, linestyle="--", mutation_scale=15), fontsize=7, fontweight='bold', color='#BE185D')

ax.set_title("MongoDB Database Entity-Relationship & Schema Diagram (ERD)", fontsize=12, fontweight='bold', pad=12, color='#0F172A')
plt.tight_layout()
plt.savefig('diagrams/database_erd.png', dpi=300, bbox_inches='tight')
plt.close()


# ─────────────────────────────────────────────────────────────────────────────
# DIAGRAM 3: Multi-Tier System Architecture & Detailed Flow
# ─────────────────────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(10, 6), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 6)
ax.axis('off')

bg = patches.Rectangle((0, 0), 10, 6, facecolor='#F8FAFC', edgecolor='none')
ax.add_patch(bg)

nodes = [
    (0.5, 4.2, 2.5, 1.2, "React.js Client SPA\n(Vite + Tailwind + MUI)", "#EFF6FF", "#3B82F6"),
    (3.8, 4.2, 2.4, 1.2, "Axios API Client\n(src/api/client.js)", "#F0FDF4", "#22C55E"),
    (7.0, 4.2, 2.5, 1.2, "Express API Server\n(backend/server.js)", "#FEF3C7", "#F59E0B"),
    (7.0, 2.0, 2.5, 1.2, "Auth Middleware\n(middleware/auth.js)", "#F3E8FF", "#A855F7"),
    (3.8, 2.0, 2.4, 1.2, "Route Controllers\n(backend/routes/*)", "#FDF2F8", "#EC4899"),
    (0.5, 2.0, 2.5, 1.2, "MongoDB Database\n(Mongoose Schemas)", "#E0F2FE", "#0284C7"),
]

for x, y, w, h, text, bg_c, border_c in nodes:
    rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.1,rounding_size=0.15", facecolor=bg_c, edgecolor=border_c, linewidth=2)
    ax.add_patch(rect)
    ax.text(x + w/2, y + h/2, text, ha='center', va='center', fontsize=9.5, fontweight='bold', color='#1E293B')

arrows = [
    ((3.0, 4.8), (3.8, 4.8), "HTTP Request"),
    ((6.2, 4.8), (7.0, 4.8), "REST Endpoint"),
    ((8.25, 4.2), (8.25, 3.2), "JWT Verification"),
    ((7.0, 2.6), (6.2, 2.6), "Authorized Request"),
    ((3.8, 2.6), (3.0, 2.6), "Mongoose Query"),
]

for (x1, y1), (x2, y2), label in arrows:
    ax.annotate("", xy=(x2, y2), xytext=(x1, y1), arrowprops=dict(arrowstyle="->", color="#64748B", lw=2, mutation_scale=15))
    mx, my = (x1 + x2)/2, (y1 + y2)/2
    ax.text(mx, my + 0.15, label, ha='center', va='center', fontsize=7.5, fontweight='semibold', color='#475569', bbox=dict(boxstyle="round,pad=0.2", facecolor="white", edgecolor="#E2E8F0", lw=0.8))

ax.set_title("SpacECE Smart Parenting Portal — System Architecture & Data Flow", fontsize=12, fontweight='bold', pad=12, color='#0F172A')
plt.tight_layout()
plt.savefig('diagrams/system_architecture.png', dpi=300, bbox_inches='tight')
plt.close()


# ─────────────────────────────────────────────────────────────────────────────
# DIAGRAM 4: Score Logging & NEP 2020 Analytics Pipeline
# ─────────────────────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(10, 4.5), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 4.5)
ax.axis('off')

bg2 = patches.Rectangle((0, 0), 10, 4.5, facecolor='#F8FAFC', edgecolor='none')
ax.add_patch(bg2)

steps = [
    (0.4, 1.5, 1.8, 1.5, "Child Plays Game\n(Math/Emotion/Story)", "#FEF9C3", "#EAB308"),
    (2.8, 1.5, 1.8, 1.5, "saveNumeracyScore\n(Activity Type Map)", "#DCFCE7", "#16A34A"),
    (5.2, 1.5, 1.8, 1.5, "MongoDB Score Log\n(Domain & Accuracy)", "#E0F2FE", "#0284C7"),
    (7.6, 1.5, 1.9, 1.5, "Parent Analytics Portal\n(Radar & NEP 2020)", "#F3E8FF", "#9333EA"),
]

for x, y, w, h, text, bg_c, border_c in steps:
    rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.1,rounding_size=0.15", facecolor=bg_c, edgecolor=border_c, linewidth=2)
    ax.add_patch(rect)
    ax.text(x + w/2, y + h/2, text, ha='center', va='center', fontsize=9, fontweight='bold', color='#1E293B')

arrows2 = [
    ((2.2, 2.25), (2.8, 2.25)),
    ((4.6, 2.25), (5.2, 2.25)),
    ((7.0, 2.25), (7.6, 2.25)),
]

for (x1, y1), (x2, y2) in arrows2:
    ax.annotate("", xy=(x2, y2), xytext=(x1, y1), arrowprops=dict(arrowstyle="->", color="#334155", lw=2.5, mutation_scale=16))

ax.set_title("End-to-End Game Score Logging & Analytics Pipeline", fontsize=11, fontweight='bold', pad=10, color='#0F172A')
plt.tight_layout()
plt.savefig('diagrams/score_pipeline.png', dpi=300, bbox_inches='tight')
plt.close()

print("All 4 comprehensive diagrams generated successfully.")
