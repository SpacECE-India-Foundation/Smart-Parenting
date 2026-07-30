import sys
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, KeepTogether, PageBreak, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#475569"))
        
        # Header (Pages 2+)
        if self._pageNumber > 1:
            self.drawString(54, 750, "SpacECE Smart Parenting Portal — Comprehensive Architecture & Skeleton Guide")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)

        # Footer (All pages)
        self.setFont("Helvetica", 8)
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 36, page_str)
        self.drawString(54, 36, "© 2026 SpacECE India Foundation — Comprehensive System & Folder Architecture Document")
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(54, 48, 558, 48)
        self.restoreState()


def create_comprehensive_pdf(filename="SpacECE_Comprehensive_Project_Architecture_Documentation.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom Palette
    PRIMARY = colors.HexColor("#F4A300")      # SpacECE Golden
    PRIMARY_DARK = colors.HexColor("#CC8A00") # Dark Gold
    SECONDARY = colors.HexColor("#0284C7")    # Deep Blue
    TEXT_DARK = colors.HexColor("#0F172A")    # Dark Slate
    TEXT_MUTED = colors.HexColor("#475569")   # Muted Slate
    BG_LIGHT = colors.HexColor("#F8FAFC")     # Light Card BG
    BORDER_COLOR = colors.HexColor("#CBD5E1")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle', parent=styles['Heading1'],
        fontName='Helvetica-Bold', fontSize=18, leading=22, textColor=TEXT_DARK, spaceAfter=4
    )

    h1_style = ParagraphStyle(
        'H1', parent=styles['Heading1'],
        fontName='Helvetica-Bold', fontSize=13, leading=17, textColor=SECONDARY, spaceBefore=14, spaceAfter=6, keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'H2', parent=styles['Heading2'],
        fontName='Helvetica-Bold', fontSize=10.5, leading=14, textColor=PRIMARY_DARK, spaceBefore=10, spaceAfter=4, keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body', parent=styles['Normal'],
        fontName='Helvetica', fontSize=8.5, leading=12, textColor=TEXT_DARK, spaceAfter=5
    )

    code_style = ParagraphStyle(
        'CodeText', parent=styles['Normal'],
        fontName='Courier', fontSize=7.5, leading=10, textColor=colors.HexColor("#1E293B")
    )

    table_header_style = ParagraphStyle(
        'TableHeader', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TableCell', parent=styles['Normal'],
        fontName='Helvetica', fontSize=7.5, leading=10, textColor=TEXT_DARK
    )

    story = []

    # ── HEADER BANNER ──────────────────────────────────────────────────────────
    logo_path = 'frontend/src/assets/spacece-logo.png'
    if os.path.exists(logo_path):
        img = Image(logo_path, width=130, height=42)
        header_table = Table([[img, Paragraph("<b>SpacECE Smart Parenting Portal</b><br/><font color='#64748B' size=8>Full-Stack MERN Technical Skeleton & Folder Blueprint</font>", title_style)]], colWidths=[140, 364])
    else:
        header_table = Table([[Paragraph("<b>SpacECE Smart Parenting Portal</b>", title_style)]], colWidths=[504])

    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(header_table)
    story.append(HRFlowable(width="100%", thickness=2.5, color=PRIMARY, spaceBefore=8, spaceAfter=10))

    # ── SECTION 1: EXECUTIVE OVERVIEW ─────────────────────────────────────────
    story.append(Paragraph("1. System Overview & Technology Stack", h1_style))
    story.append(Paragraph(
        "The <b>SpacECE Smart Parenting & Early Childhood Education Portal</b> is an end-to-end full-stack MERN application (MongoDB, Express.js, React.js, Node.js) designed for interactive early childhood learning, parent diagnostic monitoring, and educator analytics aligned with <b>NEP 2020 benchmarks</b> across 5 primary developmental domains (<i>Literacy, Numeracy, Cognitive, Creativity, Emotional</i>).",
        body_style
    ))

    # ── SECTION 2: VISUAL FILE SKELETON DIAGRAM ──────────────────────────────
    story.append(Paragraph("2. Visual Codebase Directory & Module Hierarchy Tree", h1_style))
    tree_img_path = 'diagrams/visual_file_tree.png'
    if os.path.exists(tree_img_path):
        story.append(Image(tree_img_path, width=504, height=336))
        story.append(Spacer(1, 4))

    story.append(Paragraph(
        "<b>Diagram Interpretation:</b> The project root contains dual sub-applications: <code>/backend</code> (Express REST API with Mongoose ORM) and <code>/frontend</code> (Vite-bundled React SPA). Root configuration scripts like <code>run.sh</code> manage parallel server execution.",
        body_style
    ))

    # ── SECTION 3: SYSTEM ARCHITECTURE FLOWCHART ─────────────────────────────
    story.append(PageBreak())
    story.append(Paragraph("3. High-Level Multi-Tier Architecture & Request Pipeline", h1_style))
    arch_img_path = 'diagrams/system_architecture.png'
    if os.path.exists(arch_img_path):
        story.append(Image(arch_img_path, width=504, height=302))
        story.append(Spacer(1, 4))

    story.append(Paragraph(
        "<b>Component Interaction Flow:</b> Browser requests are captured by React Router views, passed through React Contexts (AuthContext, UserContext), dispatched via Axios client with JWT headers, verified by Express Auth Middleware, handled by Route Controllers, and executed against MongoDB collections.",
        body_style
    ))

    # ── SECTION 4: BACKEND SUBSYSTEM MATRIX ──────────────────────────────────
    story.append(Paragraph("4. Backend Subsystem Matrix (`/backend`)", h1_style))

    story.append(Paragraph("Database Collections & Schemas (`backend/models/`)", h2_style))
    models_data = [
        [Paragraph("Model File", table_header_style), Paragraph("Collection", table_header_style), Paragraph("Schema Responsibilities & Attributes", table_header_style)],
        [Paragraph("User.js", table_cell_style), Paragraph("users", table_cell_style), Paragraph("User accounts: email, bcrypt password hash, role (parent/teacher/admin), emailVerified.", table_cell_style)],
        [Paragraph("ChildProfile.js", table_cell_style), Paragraph("childprofiles", table_cell_style), Paragraph("Child profile state: name, age, parent_uid link, xp, stars, coins, level, mascot, module progress.", table_cell_style)],
        [Paragraph("Score.js", table_cell_style), Paragraph("scores", table_cell_style), Paragraph("Performance logs: child_id link, game_id, activity_type, score, accuracy (%), time_spent.", table_cell_style)],
        [Paragraph("Literacy.js", table_cell_style), Paragraph("literacies", table_cell_style), Paragraph("Literacy game configurations: phonics, stories, word builder, sight words.", table_cell_style)],
        [Paragraph("CognitiveSel.js", table_cell_style), Paragraph("cognitivesels", table_cell_style), Paragraph("Cognitive & SEL game configurations: brain world, emotion check-in, branching choice stories.", table_cell_style)],
        [Paragraph("Recommendation.js", table_cell_style), Paragraph("recommendations", table_cell_style), Paragraph("AI & Educator recommendations: child_id, domain, reason, priority (High/Med/Low), status.", table_cell_style)],
        [Paragraph("Notification.js", table_cell_style), Paragraph("notifications", table_cell_style), Paragraph("Alert feed items: recipient_uid, title, body, read status, creation timestamp.", table_cell_style)],
        [Paragraph("Center.js", table_cell_style), Paragraph("centers", table_cell_style), Paragraph("Early Childhood Learning Center directory entries.", table_cell_style)],
    ]
    t_models = Table(models_data, colWidths=[100, 90, 314])
    t_models.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), SECONDARY),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT])
    ]))
    story.append(t_models)

    story.append(Spacer(1, 6))
    story.append(Paragraph("Express API Routers (`backend/routes/`)", h2_style))
    routes_data = [
        [Paragraph("Router File", table_header_style), Paragraph("Base Path", table_header_style), Paragraph("API Endpoints & Handlers", table_header_style)],
        [Paragraph("auth.js", table_cell_style), Paragraph("/api/auth", table_cell_style), Paragraph("POST /register, /login, /google, GET /me, PUT /change-password, /change-email.", table_cell_style)],
        [Paragraph("children.js", table_cell_style), Paragraph("/api/children", table_cell_style), Paragraph("GET/POST /children, GET/PUT /children/:id (profile CRUD & awardProgress).", table_cell_style)],
        [Paragraph("scores.js", table_cell_style), Paragraph("/api/scores", table_cell_style), Paragraph("POST /scores (submit score), GET /scores (fetch domain scores for analytics).", table_cell_style)],
        [Paragraph("literacy.js", table_cell_style), Paragraph("/api/literacy", table_cell_style), Paragraph("GET /literacy/games, GET /literacy/stories (phonics, story reader content).", table_cell_style)],
        [Paragraph("cognitiveSel.js", table_cell_style), Paragraph("/api/cognitive-sel", table_cell_style), Paragraph("GET /cognitive-sel/games, /branching-stories (SEL & emotion content).", table_cell_style)],
        [Paragraph("milestones.js", table_cell_style), Paragraph("/api/milestones", table_cell_style), Paragraph("GET/POST /milestones/recommendations (NEP 2020 milestone activity focus).", table_cell_style)],
        [Paragraph("notifications.js", table_cell_style), Paragraph("/api/notifications", table_cell_style), Paragraph("GET /notifications, PUT /notifications/:id/read (alert feed updates).", table_cell_style)],
    ]
    t_routes = Table(routes_data, colWidths=[90, 100, 314])
    t_routes.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_DARK),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT])
    ]))
    story.append(t_routes)

    # ── SECTION 5: DATABASE ERD DIAGRAM ───────────────────────────────────────
    story.append(PageBreak())
    story.append(Paragraph("5. MongoDB Database Entity-Relationship (ERD) Diagram", h1_style))
    erd_img_path = 'diagrams/database_erd.png'
    if os.path.exists(erd_img_path):
        story.append(Image(erd_img_path, width=504, height=294))
        story.append(Spacer(1, 4))

    story.append(Paragraph(
        "<b>Collection Relationships:</b> <code>User</code> maintains a 1:N relationship with <code>ChildProfile</code> records via <code>parent_uid</code>. Each <code>ChildProfile</code> links to multiple <code>Score</code> logs and <code>Recommendation</code> action items. System notifications map directly to target user IDs.",
        body_style
    ))

    # ── SECTION 6: FRONTEND PAGES & COMPONENTS MATRIX ─────────────────────────
    story.append(Spacer(1, 6))
    story.append(Paragraph("6. Frontend Subsystem & Page Matrix (`/frontend/src`)", h1_style))

    story.append(Paragraph("React View Pages Breakdown (`src/pages/`)", h2_style))
    pages_matrix = [
        [Paragraph("Domain Directory", table_header_style), Paragraph("Key Page Components", table_header_style), Paragraph("Responsibility & Learning Objectives", table_header_style)],
        [Paragraph("auth/", table_cell_style), Paragraph("Login, Register, RoleSelection, Terms, Privacy", table_cell_style), Paragraph("User sign-in, account creation with role pre-selection (Parent/Teacher), legal pages.", table_cell_style)],
        [Paragraph("child/", table_cell_style), Paragraph("Home (Dashboard), Adventure, AvatarPage, Awards", table_cell_style), Paragraph("Child portal dashboard, 3D island map explorer, avatar customization, reward trophies.", table_cell_style)],
        [Paragraph("numeracy/", table_cell_style), Paragraph("MathWorld, PuzzleWorld, LogicIsland, NumberAdventure", table_cell_style), Paragraph("Counting, shape side identification, size comparison, number matching, arithmetic.", table_cell_style)],
        [Paragraph("cognitive-sel/", table_cell_style), Paragraph("EmotionWorldPage, StoryWorldPage, SpatialBrainPage", table_cell_style), Paragraph("Emotion check-in, face recognition, friendship social stories, branching narratives.", table_cell_style)],
        [Paragraph("literacy/", table_cell_style), Paragraph("ReadingWorldPage, PhonicsLandPage, StoryWorldPage", table_cell_style), Paragraph("Letter phonics sounds, sight words, picture matching, independent story reader.", table_cell_style)],
        [Paragraph("analytics/", table_cell_style), Paragraph("ParentDashboard, DevelopmentalLearningCurves", table_cell_style), Paragraph("NEP 2020 domain competency radar chart, time allocation bars, school readiness score.", table_cell_style)],
        [Paragraph("parent/ & teacher/", table_cell_style), Paragraph("ParentDashboard, TeacherDashboard, ChildrenList", table_cell_style), Paragraph("Child profile management, classroom roster monitoring, assigning activity recommendations.", table_cell_style)],
        [Paragraph("settings/", table_cell_style), Paragraph("AccountSettings, ProfileSettings", table_cell_style), Paragraph("Parent & educator account credentials, display name updates, email verification.", table_cell_style)],
    ]
    t_pages = Table(pages_matrix, colWidths=[90, 150, 264])
    t_pages.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), SECONDARY),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT])
    ]))
    story.append(t_pages)

    # ── SECTION 7: SCORE PIPELINE DIAGRAM & ROLE MATRIX ──────────────────────
    story.append(PageBreak())
    story.append(Paragraph("7. Game Score Logging & Analytics Pipeline", h1_style))
    pipeline_img_path = 'diagrams/score_pipeline.png'
    if os.path.exists(pipeline_img_path):
        story.append(Image(pipeline_img_path, width=504, height=226))
        story.append(Spacer(1, 4))

    story.append(Paragraph(
        "<b>Analytics Processing Flow:</b> Activity completion in child games calls <code>saveNumeracyScore</code> which categorizes games into 5 explicit domains (<i>Literacy, Numeracy, Cognitive, Creativity, Emotional</i>). Scores logged to MongoDB are fetched by <code>analyticsService.ts</code> to calculate readiness scores and plot radar charts.",
        body_style
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("8. Platform Role & Permission Access Matrix", h1_style))
    roles_matrix = [
        [Paragraph("Role", table_header_style), Paragraph("Primary Access Paths", table_header_style), Paragraph("Capabilities & System Permissions", table_header_style)],
        [Paragraph("Child", table_cell_style), Paragraph("/child/*, /math-world, /child/emotion-world", table_cell_style), Paragraph("Play educational games, gain XP/stars/coins, unlock island paths, customize avatar.", table_cell_style)],
        [Paragraph("Parent", table_cell_style), Paragraph("/parent/*, /analytics/*, /settings/*", table_cell_style), Paragraph("Manage child profiles, view NEP 2020 milestone analytics, complete action items.", table_cell_style)],
        [Paragraph("Teacher", table_cell_style), Paragraph("/teacher/*, /analytics/teacher", table_cell_style), Paragraph("Track classroom rosters, diagnose learning delays, assign activity recommendations.", table_cell_style)],
        [Paragraph("Admin", table_cell_style), Paragraph("/admin/*", table_cell_style), Paragraph("Platform user management, system metrics oversight, configure alert thresholds.", table_cell_style)],
    ]
    t_roles = Table(roles_matrix, colWidths=[65, 160, 279])
    t_roles.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_DARK),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT])
    ]))
    story.append(t_roles)

    # Build PDF
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Comprehensive PDF document successfully created at: {filename}")

if __name__ == "__main__":
    create_comprehensive_pdf()
